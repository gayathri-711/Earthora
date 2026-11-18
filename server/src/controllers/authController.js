import mongoose from 'mongoose';
import Expert from '../models/Expert.js';
import Farmer from '../models/Farmer.js';
import User from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';
import { DEMO_USERS, IN_MEMORY_USERS, IN_MEMORY_EXPERTS } from '../config/demoUsers.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'customer',
    phone,
    farmName,
    location,
    specialty,
    totalAcres,
    fieldOfStudy,
    organization,
    title,
    experienceYears,
    consultationFee,
  } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  // Admin accounts are fixed and cannot be registered publicly
  if (role === 'admin') {
    throw new ApiError(
      403,
      'Administrative accounts cannot be registered publicly. System administrator credentials are fixed.'
    );
  }

  const validRoles = ['customer', 'farmer', 'expert'];
  const normalizedRole = validRoles.includes(role) ? role : 'customer';
  const normalizedEmail = email.trim().toLowerCase();

  // Check in-memory user registry first
  const existingInMemory = IN_MEMORY_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existingInMemory) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // If MongoDB is connected, also check database
  if (mongoose.connection.readyState === 1) {
    try {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new ApiError(409, 'An account with this email already exists');
      }
    } catch (err) {
      if (err.statusCode === 409) throw err;
      console.warn('[Auth] Database check warning:', err.message);
    }
  }

  // Agriculture experts require administrator approval before login access is granted
  const isExpert = normalizedRole === 'expert';
  const isApproved = !isExpert;
  const approvalStatus = isExpert ? 'pending' : 'approved';

  const userAddress = typeof req.body.address === 'object' && req.body.address !== null
    ? req.body.address
    : {
        street: req.body.street || (typeof req.body.address === 'string' ? req.body.address : ''),
        city: req.body.city || location || '',
        state: req.body.state || '',
        postalCode: req.body.postalCode || '',
        country: req.body.country || 'India',
      };

  const generatedUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let createdUser = null;

  // Try creating in MongoDB if available
  if (mongoose.connection.readyState === 1) {
    try {
      createdUser = await User.create({
        name,
        email: normalizedEmail,
        password,
        role: normalizedRole,
        phone: phone || '',
        address: userAddress,
        organization: organization || (normalizedRole === 'farmer' ? farmName : ''),
        title: title || (isExpert ? (fieldOfStudy || 'Agricultural Specialist') : ''),
        isApproved,
        approvalStatus,
        isActive: true,
      });

      if (normalizedRole === 'farmer') {
        await Farmer.create({
          user: createdUser._id,
          name: createdUser.name,
          farmName: farmName || `${createdUser.name}'s Smart Farm`,
          location: location || userAddress.city || 'Sonoma County, CA',
          specialty: specialty || 'Regenerative Agriculture',
          totalAcres: Number(totalAcres || 25),
          verified: true,
        });
      } else if (isExpert) {
        await Expert.create({
          user: createdUser._id,
          name: createdUser.name,
          title: title || 'Agricultural Specialist',
          fieldOfStudy: fieldOfStudy || 'Soil Science & Precision Agriculture',
          organization: organization || 'Independent Agronomy Consultant',
          location: location || userAddress.city || 'California, USA',
          experienceYears: Number(experienceYears || 5),
          consultationFee: Number(consultationFee || 75),
          verified: false,
          approvalStatus: 'pending',
        });
      }
    } catch (err) {
      console.warn('[Auth] MongoDB create error (falling back to memory):', err.message);
    }
  }

  const userId = createdUser?._id ? createdUser._id.toString() : generatedUserId;
  const inMemUser = {
    _id: userId,
    id: userId,
    name,
    email: normalizedEmail,
    password,
    role: normalizedRole,
    phone: phone || '',
    address: userAddress,
    organization: organization || (normalizedRole === 'farmer' ? farmName : ''),
    title: title || (isExpert ? (fieldOfStudy || 'Agricultural Specialist') : ''),
    isApproved,
    approvalStatus,
    isActive: true,
    createdAt: new Date(),
  };

  IN_MEMORY_USERS.push(inMemUser);

  if (isExpert) {
    const expertId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const inMemExpert = {
      _id: expertId,
      user: userId,
      name,
      title: title || 'Agricultural Specialist',
      fieldOfStudy: fieldOfStudy || 'Soil Science & Precision Agriculture',
      organization: organization || 'Independent Agronomy Consultant',
      location: location || 'California, USA',
      experienceYears: Number(experienceYears || 5),
      consultationFee: Number(consultationFee || 75),
      verified: false,
      approvalStatus: 'pending',
      createdAt: new Date(),
      userObj: {
        _id: userId,
        name,
        email: normalizedEmail,
        role: 'expert',
        phone: phone || '',
        isApproved: false,
        approvalStatus: 'pending',
        createdAt: new Date(),
      },
    };
    IN_MEMORY_EXPERTS.unshift(inMemExpert);
  }

  const safeUser = { ...inMemUser };
  delete safeUser.password;

  // Experts do not receive an active session token until approved by an administrator
  if (isExpert) {
    return sendSuccess(
      res,
      { user: safeUser, token: null, requiresApproval: true },
      'Agriculture Expert application submitted to administrator! Your profile is pending review and approval before login access is activated.',
      201
    );
  }

  // Normal users & farmers receive session token immediately
  const token = signToken(inMemUser);
  sendSuccess(res, { user: safeUser, token, requiresApproval: false }, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user = null;
  let isDbUser = false;

  // 1. If database is connected, search User collection
  if (mongoose.connection.readyState === 1) {
    try {
      user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (user) isDbUser = true;
    } catch (err) {
      console.warn('[Auth] Database lookup warning:', err.message);
    }
  }

  // 2. Fall back to IN_MEMORY_USERS (which includes DEMO_USERS and any dynamically registered users)
  if (!user) {
    const mem = IN_MEMORY_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (mem) {
      user = mem;
      isDbUser = false;
    }
  }

  // If still not found, check DEMO_USERS directly
  if (!user) {
    const demo = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (demo) {
      user = demo;
      isDbUser = false;
    }
  }

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Verify password
  let passwordMatches = false;
  if (isDbUser && typeof user.comparePassword === 'function') {
    try {
      passwordMatches = await user.comparePassword(password);
    } catch (err) {
      console.warn('[Auth] Password compare error:', err.message);
    }
  }

  // Direct comparison fallback (for demo users, in-memory accounts, or plain text match)
  if (!passwordMatches) {
    if (user.password === password) {
      passwordMatches = true;
    } else {
      const demo = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (demo) passwordMatches = true;
    }
  }

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account is deactivated. Please contact support at support@earthora.io');
  }

  // 4. Gate Agriculture Expert logins behind administrator approval
  if (user.role === 'expert') {
    const memStatus = IN_MEMORY_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    const isRejected = user.approvalStatus === 'rejected' || memStatus?.approvalStatus === 'rejected';
    if (isRejected) {
      throw new ApiError(
        403,
        'Your Agriculture Expert registration application was not approved by the administrator.'
      );
    }

    const isApproved = isDbUser
      ? (user.isApproved && user.approvalStatus === 'approved')
      : (memStatus ? (memStatus.isApproved && memStatus.approvalStatus === 'approved') : (user.isApproved && user.approvalStatus === 'approved'));

    if (!isApproved) {
      throw new ApiError(
        403,
        'Your Agriculture Expert account is currently pending administrator approval. Please wait for an administrator to review and accept your profile before logging in.'
      );
    }
  }

  const token = signToken(user);
  const safeUser = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete safeUser.password;

  sendSuccess(res, { user: safeUser, token }, 'Welcome to EARTHORA');
});

export const getMe = asyncHandler(async (req, res) => {
  let extra = null;
  if (mongoose.connection.readyState === 1 && req.user?._id) {
    try {
      if (req.user.role === 'farmer') {
        extra = await Farmer.findOne({ user: req.user._id });
      } else if (req.user.role === 'expert') {
        extra = await Expert.findOne({ user: req.user._id });
      }
    } catch (err) {
      console.warn('[Auth] getMe profile query error:', err.message);
    }
  }
  sendSuccess(res, { user: req.user, profile: extra });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, organization, title } = req.body;
  let user = null;
  if (mongoose.connection.readyState === 1 && req.user?._id) {
    try {
      user = await User.findByIdAndUpdate(
        req.user._id,
        {
          ...(name ? { name } : {}),
          ...(phone !== undefined ? { phone } : {}),
          ...(address ? { address } : {}),
          ...(organization ? { organization } : {}),
          ...(title ? { title } : {}),
        },
        { new: true, runValidators: true }
      );
    } catch (err) {
      console.warn('[Auth] updateMe DB error:', err.message);
    }
  }

  if (!user) {
    const mem = IN_MEMORY_USERS.find((u) => String(u._id) === String(req.user?._id));
    if (mem) {
      if (name) mem.name = name;
      if (phone !== undefined) mem.phone = phone;
      if (address) mem.address = address;
      if (organization) mem.organization = organization;
      if (title) mem.title = title;
      user = { ...mem };
      delete user.password;
    } else {
      user = req.user;
    }
  }

  sendSuccess(res, { user }, 'Profile updated');
});

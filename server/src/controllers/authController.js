import Expert from '../models/Expert.js';
import Farmer from '../models/Farmer.js';
import User from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';
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

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Agriculture experts require administrator approval before login access is granted
  const isExpert = normalizedRole === 'expert';
  const isApproved = !isExpert;
  const approvalStatus = isExpert ? 'pending' : 'approved';

  const user = await User.create({
    name,
    email,
    password,
    role: normalizedRole,
    phone: phone || '',
    organization: organization || (normalizedRole === 'farmer' ? farmName : ''),
    title: title || (normalizedRole === 'expert' ? 'Agricultural Specialist' : ''),
    isApproved,
    approvalStatus,
    isActive: true,
  });

  if (normalizedRole === 'farmer') {
    await Farmer.create({
      user: user._id,
      name: user.name,
      farmName: farmName || `${user.name}'s Smart Farm`,
      location: location || 'Sonoma County, CA',
      specialty: specialty || 'Regenerative Agriculture',
      totalAcres: Number(totalAcres || 25),
      verified: true,
    });
  } else if (normalizedRole === 'expert') {
    await Expert.create({
      user: user._id,
      name: user.name,
      title: title || 'Agricultural Specialist',
      fieldOfStudy: fieldOfStudy || 'Soil Science & Precision Agriculture',
      organization: organization || 'Independent Agronomy Consultant',
      location: location || 'California, USA',
      experienceYears: Number(req.body.experienceYears || 5),
      consultationFee: Number(req.body.consultationFee || 75),
      verified: false,
      approvalStatus: 'pending',
    });
  }

  const safeUser = user.toObject();
  delete safeUser.password;

  // Experts do not receive a session token until approved by an administrator
  if (isExpert) {
    return sendSuccess(
      res,
      { user: safeUser, token: null, requiresApproval: true },
      'Agriculture Expert registration submitted successfully. Your account is pending administrator review and approval before login access is activated.',
      201
    );
  }

  // Normal users & customers receive token immediately
  const token = signToken(user);
  sendSuccess(res, { user: safeUser, token, requiresApproval: false }, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account is deactivated. Please contact support at support@earthora.io');
  }

  // Gate Agriculture Expert logins behind admin approval
  if (user.role === 'expert') {
    if (user.approvalStatus === 'pending' || !user.isApproved) {
      throw new ApiError(
        403,
        'Your Agriculture Expert account is currently pending administrator approval. Please wait for an administrator to review and accept your profile before logging in.'
      );
    }
    if (user.approvalStatus === 'rejected') {
      throw new ApiError(
        403,
        'Your Agriculture Expert registration application was not approved by the administrator.'
      );
    }
  }

  const token = signToken(user);
  const safeUser = user.toObject();
  delete safeUser.password;

  sendSuccess(res, { user: safeUser, token }, 'Welcome to EARTHORA');
});

export const getMe = asyncHandler(async (req, res) => {
  let extra = null;
  if (req.user.role === 'farmer') {
    extra = await Farmer.findOne({ user: req.user._id });
  } else if (req.user.role === 'expert') {
    extra = await Expert.findOne({ user: req.user._id });
  }
  sendSuccess(res, { user: req.user, profile: extra });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address, organization, title } = req.body;
  const user = await User.findByIdAndUpdate(
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

  sendSuccess(res, { user }, 'Profile updated');
});

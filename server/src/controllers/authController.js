import Farmer from '../models/Farmer.js';
import User from '../models/User.js';
import { signToken } from '../middleware/authMiddleware.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, farmName, location, specialty } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const normalizedRole = role === 'farmer' ? 'farmer' : 'customer';
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: normalizedRole,
    phone: phone || '',
  });

  if (normalizedRole === 'farmer') {
    await Farmer.create({
      user: user._id,
      name: user.name,
      farmName: farmName || `${user.name}'s Organic Farm`,
      location: location || 'Regional Organic Hub',
      specialty: specialty || 'Seasonal Organic Produce',
      verified: false,
    });
  }

  const token = signToken(user);
  const safeUser = user.toObject();
  delete safeUser.password;

  sendSuccess(res, { user: safeUser, token }, 'Account created', 201);
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

  const token = signToken(user);
  const safeUser = user.toObject();
  delete safeUser.password;

  sendSuccess(res, { user: safeUser, token }, 'Signed in');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(address ? { address } : {}),
    },
    { new: true, runValidators: true }
  );

  sendSuccess(res, { user }, 'Profile updated');
});


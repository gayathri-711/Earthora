import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { DEMO_USERS } from '../config/demoUsers.js';
import { ApiError, asyncHandler } from '../utils/http.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agriva-dev-secret-change-in-production';

export function signToken(user) {
  const userId = user._id ? user._id.toString() : user.id;
  return jwt.sign({ id: userId, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = header.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired session token');
  }

  let user = null;
  if (mongoose.connection.readyState === 1 && decoded.id) {
    try {
      user = await User.findById(decoded.id);
    } catch (err) {
      console.warn('[AuthMiddleware] DB findById warning:', err.message);
    }
  }

  // Fallback to demo user if database is disconnected or user was authenticated in demo mode
  if (!user) {
    const demo = DEMO_USERS.find(
      (u) => u._id === decoded.id || u.role === decoded.role
    );
    if (demo && demo.isActive) {
      user = { ...demo };
      delete user.password;
    }
  }

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User account not found or inactive');
  }

  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
      if (mongoose.connection.readyState === 1 && decoded.id) {
        req.user = await User.findById(decoded.id);
      } else {
        const demo = DEMO_USERS.find((u) => u._id === decoded.id || u.role === decoded.role);
        req.user = demo ? { ...demo } : null;
      }
    } catch {
      req.user = null;
    }
  }
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};


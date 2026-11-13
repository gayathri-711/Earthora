import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const FIXED_ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@earthora.io',
  password: process.env.ADMIN_PASSWORD || 'Earthora123!',
  name: 'Earthora Platform Administrator',
  role: 'admin',
  phone: '+1 800 555 0194',
  organization: 'EARTHORA Headquarters',
};

/**
 * Guarantees that the fixed platform administrator account always exists,
 * is active, approved, and has the designated fixed credentials.
 */
export async function ensureFixedAdmin() {
  try {
    const adminEmails = [
      FIXED_ADMIN_CREDENTIALS.email.toLowerCase(),
      'admin@earthora.com',
    ];

    for (const email of adminEmails) {
      let admin = await User.findOne({ email }).select('+password');

      if (!admin) {
        await User.create({
          name: FIXED_ADMIN_CREDENTIALS.name,
          email,
          password: FIXED_ADMIN_CREDENTIALS.password,
          role: 'admin',
          phone: FIXED_ADMIN_CREDENTIALS.phone,
          organization: FIXED_ADMIN_CREDENTIALS.organization,
          isActive: true,
          isApproved: true,
          approvalStatus: 'approved',
        });
      } else {
        let needsSave = false;
        if (admin.role !== 'admin') {
          admin.role = 'admin';
          needsSave = true;
        }
        if (!admin.isActive) {
          admin.isActive = true;
          needsSave = true;
        }
        if (!admin.isApproved || admin.approvalStatus !== 'approved') {
          admin.isApproved = true;
          admin.approvalStatus = 'approved';
          needsSave = true;
        }
        const matchesPassword = await admin.comparePassword(FIXED_ADMIN_CREDENTIALS.password);
        if (!matchesPassword) {
          admin.password = FIXED_ADMIN_CREDENTIALS.password;
          needsSave = true;
        }
        if (needsSave) {
          await admin.save();
        }
      }
    }
  } catch (err) {
    console.error('Failed to ensure fixed admin account:', err.message);
  }
}

import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, default: 'Senior Agronomist' },
    fieldOfStudy: {
      type: String,
      required: true,
      default: 'Soil Microbiology & Regenerative Systems',
    },
    organization: { type: String, default: 'Earthora Agronomy Advisory' },
    experienceYears: { type: Number, default: 12 },
    location: { type: String, required: true, default: 'Davis, CA' },
    consultationFee: { type: Number, default: 75 },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 28 },
    bio: { type: String, default: '' },
    specializations: {
      type: [String],
      default: ['Soil pH Optimization', 'Organic Pest IPM', 'Precision Drip', 'Crop Rotation'],
    },
    image: { type: String, default: '/assets/img/experts/expert-aris-thorne.jpg' },
    availableDays: { type: [String], default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    verified: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Expert', expertSchema);


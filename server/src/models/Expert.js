import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, default: 'Senior Agronomist' },
    qualification: {
      type: String,
      default: 'Ph.D / M.Sc in Agronomy & Soil Science',
      trim: true,
    },
    specialization: {
      type: String,
      default: 'Soil Microbiology & Regenerative Systems',
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
      default: 'Soil Microbiology & Regenerative Systems',
    },
    organization: { type: String, default: 'Earthora Agronomy Advisory' },
    experienceYears: { type: Number, default: 12 },
    location: { type: String, required: true, default: 'Davis, CA' },
    consultationFee: { type: Number, default: 1500 },
    rating: { type: Number, default: 4.9 },
    reviewCount: { type: Number, default: 28 },
    bio: {
      type: String,
      default: 'Specialist in biological nutrient cycling, organic pest IPM, and soil rhizosphere optimization.',
    },
    specializations: {
      type: [String],
      default: ['Soil pH Optimization', 'Organic Pest IPM', 'Precision Drip', 'Crop Rotation'],
    },
    image: { type: String, default: '/assets/img/experts/expert-aris-thorne.jpg' },
    phone: { type: String, default: '' },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    verified: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    completedConsultations: { type: Number, default: 14 },
    totalEarnings: { type: Number, default: 25200 },
  },
  { timestamps: true }
);

export default mongoose.model('Expert', expertSchema);


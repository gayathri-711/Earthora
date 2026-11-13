import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    farmName: { type: String, required: true, trim: true },
    specialty: { type: String, default: 'Organic Produce' },
    location: { type: String, required: true, trim: true },
    experience: { type: String, default: '5+ Years' },
    certifications: { type: [String], default: ['USDA Organic'] },
    bio: { type: String, default: '' },
    image: { type: String, default: '/assets/img/home-3/team/01.jpg' },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Farmer', farmerSchema);


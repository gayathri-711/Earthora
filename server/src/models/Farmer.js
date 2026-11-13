import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    farmName: { type: String, required: true, trim: true },
    specialty: { type: String, default: 'Regenerative Agriculture' },
    location: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, default: 38.2919 },
      lng: { type: Number, default: -122.458 },
    },
    totalAcres: { type: Number, default: 25 },
    cultivatedAcres: { type: Number, default: 20 },
    primaryCrops: { type: [String], default: ['Heirloom Vegetables', 'Heritage Grains'] },
    soilType: { type: String, default: 'Clay Loam' },
    irrigationType: { type: String, default: 'Precision Drip & Rainwater Harvesting' },
    experience: { type: String, default: '8+ Years' },
    certifications: { type: [String], default: ['USDA Organic', 'Regenerative Verified'] },
    bio: { type: String, default: '' },
    image: { type: String, default: '/assets/img/home-3/team/01.jpg' },
    coverImage: { type: String, default: '/assets/img/home-1/hero/slider-1.jpg' },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Farmer', farmerSchema);

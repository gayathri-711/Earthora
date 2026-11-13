import mongoose from 'mongoose';

const soilTestSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    farmName: { type: String, default: 'Green Valley Organic' },
    fieldName: { type: String, required: true, default: 'East Terrace Plot' },
    sampleId: { type: String, required: true, unique: true },
    soilType: { type: String, required: true, default: 'Alluvial Clay Loam' },
    pH: { type: Number, required: true, default: 6.8 },
    nitrogen: { type: Number, required: true, default: 142 }, // kg/ha
    phosphorus: { type: Number, required: true, default: 48 }, // kg/ha
    potassium: { type: Number, required: true, default: 220 }, // kg/ha
    organicCarbon: { type: Number, required: true, default: 3.6 }, // %
    moistureLevel: { type: Number, required: true, default: 28 }, // %
    microbialActivity: { type: String, default: 'High (Bacterial-Fungal Balanced)' },
    status: {
      type: String,
      enum: ['Optimal', 'Moderate', 'Needs Attention', 'Critical'],
      default: 'Optimal',
    },
    recommendations: {
      type: [String],
      default: [
        'Maintain clover/vetch winter cover crop to stabilize nitrogen.',
        'Apply composted biochar to improve cation exchange capacity.',
        'Optimal soil pH for upcoming brassica and nightshade planting.',
      ],
    },
    testedBy: { type: String, default: 'Earthora Agritech Labs' },
    dateTested: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('SoilTest', soilTestSchema);


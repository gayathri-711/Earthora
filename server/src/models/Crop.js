import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    farmName: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    variety: { type: String, default: 'Standard Organic' },
    fieldName: { type: String, required: true, default: 'North Field A' },
    acreage: { type: Number, required: true, default: 5 },
    plantingDate: { type: Date, default: Date.now },
    estimatedHarvestDate: { type: Date, required: true },
    actualHarvestDate: { type: Date },
    status: {
      type: String,
      enum: ['Seedling', 'Vegetative', 'Flowering', 'Maturing', 'Harvested'],
      default: 'Vegetative',
    },
    growthProgress: { type: Number, min: 0, max: 100, default: 35 },
    expectedYieldKg: { type: Number, default: 2400 },
    soilHealthScore: { type: Number, min: 0, max: 100, default: 88 },
    irrigationLogs: [
      {
        date: { type: Date, default: Date.now },
        amountLiters: { type: Number, default: 1200 },
        method: { type: String, default: 'Precision Drip' },
      },
    ],
    fertilizerLogs: [
      {
        date: { type: Date, default: Date.now },
        type: { type: String, default: 'Organic Compost Tea' },
        quantityKg: { type: Number, default: 50 },
        organic: { type: Boolean, default: true },
      },
    ],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);


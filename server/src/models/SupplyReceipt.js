import mongoose from 'mongoose';

const supplyReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, required: true, unique: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true, trim: true },
    category: { type: String, default: 'produce' },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    supplierName: { type: String, required: true, trim: true },
    supplierContact: { type: String, default: '' },
    supplierLocation: { type: String, default: '' },
    quantityReceived: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'kg' },
    unitCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    batchNumber: { type: String, default: '' },
    receivedAt: { type: Date, default: Date.now },
    receivedBy: { type: String, default: 'Earthora Central Sorting Hub' },
    qualityStatus: {
      type: String,
      enum: ['Passed - Grade A Organic', 'Passed - Grade B', 'Pending Inspection', 'Rejected'],
      default: 'Passed - Grade A Organic',
    },
    warehouseLocation: { type: String, default: 'Central Cold Storage Hub A' },
    notes: { type: String, default: '' },
    stockUpdated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SupplyReceipt', supplyReceiptSchema);

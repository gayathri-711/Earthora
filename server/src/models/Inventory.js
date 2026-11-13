import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    changeAmount: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: { type: String, enum: ['seed', 'order', 'restock', 'adjustment'], default: 'adjustment' },
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);


import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      deliverySlot: { type: String, default: 'Standard Delivery (2-3 business days)' },
    },
    paymentMethod: { type: String, enum: ['card', 'cod', 'transfer'], default: 'card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
    status: {
      type: String,
      enum: ['pending', 'harvested', 'shipped', 'delivered', 'cancelled', 'Placed', 'Processing', 'Dispatched', 'Delivered'],
      default: 'Placed',
    },
    couponCode: { type: String, default: null },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

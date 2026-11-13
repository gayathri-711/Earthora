import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSchema);


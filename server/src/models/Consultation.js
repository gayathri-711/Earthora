import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true, default: '10:00 AM - 11:00 AM' },
    topic: { type: String, required: true },
    cropFocus: { type: String, default: 'Mixed Crops' },
    notes: { type: String, default: '' },
    fee: { type: Number, default: 75 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Confirmed',
    },
    prescription: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model('Consultation', consultationSchema);

const questionSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Soil Health', 'Pest Control', 'Irrigation', 'Crop Diseases', 'Organic Certification'],
      default: 'Soil Health',
    },
    details: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    answers: [
      {
        expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert' },
        expertName: { type: String, required: true },
        answerText: { type: String, required: true },
        verified: { type: Boolean, default: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);


import { Consultation, Question } from '../models/Consultation.js';
import Expert from '../models/Expert.js';
import { ApiError, asyncHandler, sendSuccess } from '../utils/http.js';

export const getExperts = asyncHandler(async (req, res) => {
  const { specialization, search } = req.query;
  const filter = { verified: true };
  if (specialization) {
    filter.specializations = { $in: [specialization] };
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { fieldOfStudy: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
    ];
  }

  const experts = await Expert.find(filter).sort({ rating: -1 });
  sendSuccess(res, { experts });
});

export const getExpertById = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id);
  if (!expert) throw new ApiError(404, 'Agricultural expert profile not found');
  sendSuccess(res, { expert });
});

export const bookConsultation = asyncHandler(async (req, res) => {
  const { expertId, clientName, clientEmail, date, timeSlot, topic, cropFocus, notes } = req.body;
  if (!expertId || !topic || !date) {
    throw new ApiError(400, 'Expert, consultation topic, and date are required');
  }

  const expert = await Expert.findById(expertId);
  if (!expert) throw new ApiError(404, 'Expert not found');

  const consultation = await Consultation.create({
    expert: expert._id,
    user: req.user?._id || expert.user,
    clientName: clientName || req.user?.name || 'Sustainable Grower',
    clientEmail: clientEmail || req.user?.email || 'grower@earthora.io',
    date: new Date(date),
    timeSlot: timeSlot || '10:00 AM - 11:00 AM',
    topic,
    cropFocus: cropFocus || 'General Regenerative Agriculture',
    notes: notes || '',
    fee: expert.consultationFee,
    status: 'Confirmed',
  });

  sendSuccess(res, { consultation }, 'Consultation session scheduled', 201);
});

export const getConsultations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user) {
    if (req.user.role === 'expert') {
      const expert = await Expert.findOne({ user: req.user._id });
      if (expert) filter.expert = expert._id;
    } else if (req.user.role === 'customer' || req.user.role === 'farmer') {
      filter.user = req.user._id;
    }
  }

  const consultations = await Consultation.find(filter)
    .populate('expert', 'name title fieldOfStudy image location')
    .sort({ date: -1 });
  sendSuccess(res, { consultations });
});

export const updateConsultationStatus = asyncHandler(async (req, res) => {
  const { status, prescription } = req.body;
  const consultation = await Consultation.findById(req.params.id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');

  if (status) consultation.status = status;
  if (prescription) consultation.prescription = prescription;
  await consultation.save();

  sendSuccess(res, { consultation }, 'Consultation updated');
});

// Q&A System
export const getQuestions = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { details: { $regex: search, $options: 'i' } },
    ];
  }

  const questions = await Question.find(filter).sort({ createdAt: -1 });
  sendSuccess(res, { questions });
});

export const askQuestion = asyncHandler(async (req, res) => {
  const { title, category, details } = req.body;
  if (!title || !details) throw new ApiError(400, 'Question title and details are required');

  const question = await Question.create({
    author: req.user?._id || '6af5d587bb44baa8261ad901',
    authorName: req.user?.name || 'Curious Grower',
    title,
    category: category || 'Soil Health',
    details,
  });

  sendSuccess(res, { question }, 'Question posted to Agronomy Forum', 201);
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { answerText, expertName } = req.body;
  if (!answerText) throw new ApiError(400, 'Answer text is required');

  const question = await Question.findById(req.params.id);
  if (!question) throw new ApiError(404, 'Question not found');

  let expert = null;
  if (req.user && req.user.role === 'expert') {
    expert = await Expert.findOne({ user: req.user._id });
  }

  question.answers.push({
    expert: expert?._id || null,
    expertName: expert?.name || expertName || req.user?.name || 'Verified Agronomist',
    answerText,
    verified: true,
    answeredAt: new Date(),
  });

  await question.save();
  sendSuccess(res, { question }, 'Expert response published');
});

export const upvoteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );
  if (!question) throw new ApiError(404, 'Question not found');
  sendSuccess(res, { question }, 'Upvoted');
});


import { Router } from 'express';
import {
  answerQuestion,
  askQuestion,
  bookConsultation,
  getConsultations,
  getExpertById,
  getExperts,
  getQuestions,
  updateConsultationStatus,
  upvoteQuestion,
} from '../controllers/expertController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

// Experts directory
router.get('/', getExperts);
router.get('/profile/:id', getExpertById);

// Consultations
router.get('/consultations', protect, getConsultations);
router.post('/consultations', optionalAuth, bookConsultation);
router.patch('/consultations/:id', protect, updateConsultationStatus);

// Q&A
router.get('/questions', getQuestions);
router.post('/questions', optionalAuth, askQuestion);
router.post('/questions/:id/answers', optionalAuth, answerQuestion);
router.patch('/questions/:id/upvote', upvoteQuestion);

export default router;

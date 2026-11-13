import { Router } from 'express';
import { chatWithAI, getAISuggestions } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', chatWithAI);
router.get('/suggestions', getAISuggestions);

export default router;

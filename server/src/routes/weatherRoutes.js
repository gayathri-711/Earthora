import { Router } from 'express';
import { getWeatherIntelligence } from '../controllers/weatherController.js';

const router = Router();

router.get('/', getWeatherIntelligence);

export default router;

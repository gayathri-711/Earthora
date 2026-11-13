import { processAIChat, getQuickSuggestions } from '../services/aiChatService.js';

/**
 * Handle incoming user question for EARTHORA AI
 * POST /api/v1/ai/chat
 */
export async function chatWithAI(req, res, next) {
  try {
    const { message, history, context } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid text question or message is required.',
      });
    }

    const aiResponse = await processAIChat({
      message,
      history: Array.isArray(history) ? history : [],
      context: context && typeof context === 'object' ? context : {},
    });

    return res.status(200).json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        ...aiResponse,
      },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get curated suggestions and starter questions
 * GET /api/v1/ai/suggestions
 */
export function getAISuggestions(_req, res) {
  const suggestions = getQuickSuggestions();
  return res.status(200).json({
    success: true,
    data: suggestions,
  });
}

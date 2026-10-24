import express from 'express';
import {
  getAllCars,
  getCarById,
  getRecommendations,
  compareCars,
  getDnaMatchResult,
  getSemanticSearch,
  getCacheMetrics,
} from '../controllers/carController.js';
import {
  standardApiLimiter,
  aiEndpointLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply standard API rate limiter across all car routes
router.use(standardApiLimiter);

router.get('/', getAllCars);
router.get('/metrics/cache', getCacheMetrics);
router.get('/:id', getCarById);
router.post('/recommendations', aiEndpointLimiter, getRecommendations);
router.post('/compare', compareCars);
router.post('/dna-match', aiEndpointLimiter, getDnaMatchResult);
router.post('/semantic-search', aiEndpointLimiter, getSemanticSearch);

export default router;

import express from 'express';
import {
  getAllCars,
  getCarById,
  getRecommendations,
  compareCars,
} from '../controllers/carController.js';

const router = express.Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/recommendations', getRecommendations);
router.post('/compare', compareCars);

export default router;

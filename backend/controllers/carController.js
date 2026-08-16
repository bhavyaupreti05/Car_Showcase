import Car from '../models/Car.js';
import { getCarRecommendations, getCarComparison } from '../services/openaiService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllCars = asyncHandler(async (req, res) => {
  const {
    brand,
    model,
    fuelType,
    bodyType,
    minPrice,
    maxPrice,
    transmission,
    sort,
    limit = 10,
    page = 1,
  } = req.query;

  // Build filter object
  const filter = {};
  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (fuelType) filter.fuelType = fuelType;
  if (bodyType) filter.bodyType = bodyType;
  if (transmission) filter.transmission = transmission;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Calculate pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Fetch cars
  const cars = await Car.find(filter)
    .sort(sort ? { [sort]: -1 } : { createdAt: -1 })
    .limit(limitNum)
    .skip(skip);

  const total = await Car.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: cars,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const getCarById = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  res.status(200).json({
    success: true,
    data: car,
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a search query',
    });
  }

  // Fetch all cars to provide context to AI
  const allCars = await Car.find().limit(50);

  if (allCars.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No cars available in database',
    });
  }

  // Get AI recommendations
  const recommendations = await getCarRecommendations(query, allCars);

  // Map recommendation names to actual car objects
  const recommendedCars = [];
  for (const rec of recommendations.recommendations) {
    const car = allCars.find(
      (c) =>
        c.name.toLowerCase().includes(rec.name.toLowerCase()) ||
        (c.brand.toLowerCase().includes(rec.brand.toLowerCase()) &&
          c.model.toLowerCase().includes(rec.name.split(' ').pop().toLowerCase()))
    );

    if (car) {
      recommendedCars.push({
        ...car.toObject(),
        aiReason: rec.reason,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      recommendations: recommendedCars.slice(0, 5),
      summary: recommendations.summary,
      query,
    },
  });
});

export const compareCars = asyncHandler(async (req, res) => {
  const { car1Id, car2Id } = req.body;

  if (!car1Id || !car2Id) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both car IDs for comparison',
    });
  }

  if (car1Id === car2Id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot compare a car with itself',
    });
  }

  const car1 = await Car.findById(car1Id);
  const car2 = await Car.findById(car2Id);

  if (!car1 || !car2) {
    return res.status(404).json({
      success: false,
      message: 'One or both cars not found',
    });
  }

  // Get AI comparison
  const comparison = await getCarComparison(car1, car2);

  res.status(200).json({
    success: true,
    data: {
      car1: car1.toObject(),
      car2: car2.toObject(),
      comparison,
    },
  });
});

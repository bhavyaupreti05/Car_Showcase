import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a car name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide a model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide a year'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    priceDisplay: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
      required: [true, 'Please specify fuel type'],
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      required: true,
    },
    mileage: {
      type: Number,
      required: [true, 'Please provide mileage (kmpl/km/kwh)'],
    },
    mileageUnit: {
      type: String,
      enum: ['kmpl', 'km', 'kwh'],
      default: 'kmpl',
    },
    seatingCapacity: {
      type: Number,
      default: 5,
    },
    driveType: {
      type: String,
      enum: ['fwd', 'rwd', 'awd'],
      default: 'fwd',
    },
    color: {
      type: String,
      default: 'White',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [String],
    safetyRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    bodyType: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'coupe', 'wagon', 'pickup'],
      required: true,
    },
    engineSize: {
      type: String,
      required: true,
    },
    power: {
      type: Number,
      required: true,
    },
    torque: {
      type: Number,
      required: true,
    },
    acceleration: {
      type: Number,
      required: true,
    },
    topSpeed: {
      type: Number,
      required: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model('Car', carSchema);
export default Car;

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

import { isConnectedToDB } from '../config/database.js';
import dummyCars from '../seeds/dummyCars.js';

const MongooseCar = mongoose.models.Car || mongoose.model('Car', carSchema);

const normalizeCar = (car) => ({
  ...car,
  toObject() {
    return { ...this };
  },
});

const inMemoryCars = dummyCars.map(normalizeCar);

const filterCars = (filter = {}) => {
  return inMemoryCars.filter((car) => {
    if (filter.brand) {
      const brandRegex = filter.brand.$regex ? new RegExp(filter.brand.$regex, filter.brand.$options || 'i') : new RegExp(filter.brand, 'i');
      if (!brandRegex.test(car.brand)) return false;
    }
    if (filter.model) {
      const modelRegex = filter.model.$regex ? new RegExp(filter.model.$regex, filter.model.$options || 'i') : new RegExp(filter.model, 'i');
      if (!modelRegex.test(car.model)) return false;
    }
    if (filter.fuelType && car.fuelType?.toLowerCase() !== filter.fuelType.toLowerCase()) {
      return false;
    }
    if (filter.bodyType && car.bodyType?.toLowerCase() !== filter.bodyType.toLowerCase()) {
      return false;
    }
    if (filter.transmission && car.transmission?.toLowerCase() !== filter.transmission.toLowerCase()) {
      return false;
    }
    if (filter.price) {
      if (filter.price.$gte !== undefined && car.price < filter.price.$gte) return false;
      if (filter.price.$lte !== undefined && car.price > filter.price.$lte) return false;
    }
    return true;
  });
};

class InMemoryQuery {
  constructor(items) {
    this.items = [...items];
  }

  sort(sortObj) {
    if (sortObj && typeof sortObj === 'object') {
      const [key, dir] = Object.entries(sortObj)[0] || [];
      if (key) {
        this.items.sort((a, b) => {
          if (a[key] < b[key]) return dir === -1 ? 1 : -1;
          if (a[key] > b[key]) return dir === -1 ? -1 : 1;
          return 0;
        });
      }
    }
    return this;
  }

  skip(n) {
    this.items = this.items.slice(n);
    return this;
  }

  limit(n) {
    this.items = this.items.slice(0, n);
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.items).then(resolve, reject);
  }

  catch(reject) {
    return Promise.resolve(this.items).catch(reject);
  }
}

const Car = new Proxy(MongooseCar, {
  get(target, prop, receiver) {
    if (isConnectedToDB) {
      return Reflect.get(target, prop, receiver);
    }

    if (prop === 'find') {
      return (filter) => {
        const filtered = filter ? filterCars(filter) : [...inMemoryCars];
        return new InMemoryQuery(filtered);
      };
    }
    if (prop === 'findById') {
      return async (id) => {
        const found = inMemoryCars.find((c) => String(c._id) === String(id));
        return found ? normalizeCar(found) : null;
      };
    }
    if (prop === 'countDocuments') {
      return async (filter) => {
        const filtered = filter ? filterCars(filter) : inMemoryCars;
        return filtered.length;
      };
    }
    if (prop === 'deleteMany') {
      return async () => ({ deletedCount: 0 });
    }
    if (prop === 'insertMany') {
      return async (docs) => docs;
    }

    return Reflect.get(target, prop, receiver);
  },
});

export default Car;

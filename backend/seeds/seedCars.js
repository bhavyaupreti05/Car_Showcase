import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import { connectDB } from '../config/database.js';
import dummyCars from './dummyCars.js';

dotenv.config();

await connectDB();

const cars = dummyCars;

async function seedCars() {
  try {
    // Clear existing data
    await Car.deleteMany({});
    console.log('Cleared existing car data');

    // Insert new data
    const insertedCars = await Car.insertMany(cars);
    console.log(`✅ Successfully seeded ${insertedCars.length} cars`);

    // Display sample data
    console.log('\n📊 Sample cars added:');
    insertedCars.slice(0, 3).forEach((car) => {
      console.log(`  - ${car.name} (${car.brand}): ₹${car.priceDisplay}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding cars:', error.message);
    process.exit(1);
  }
}

seedCars();

import test from 'node:test';
import assert from 'node:assert/strict';
import { queryCache } from '../utils/cacheManager.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import {
  encodeCarVector,
  encodeQueryVector,
  cosineSimilarity,
  searchByVector,
} from '../services/vectorSearchService.js';
import { calculateCarDna } from '../services/openaiService.js';

test('System Design: In-Memory LRU Cache Manager', async (t) => {
  queryCache.clear();

  // Test set and get
  queryCache.set('test:key1', { name: 'Toyota Supra' }, 10, 150);
  const val = queryCache.get('test:key1');
  assert.equal(val?.name, 'Toyota Supra');

  // Test cache hit metrics
  const metrics = queryCache.getMetrics();
  assert.equal(metrics.hits, 1);
  assert.equal(metrics.misses, 0);

  // Test cache miss
  const missing = queryCache.get('test:nonexistent');
  assert.equal(missing, null);
  const updatedMetrics = queryCache.getMetrics();
  assert.equal(updatedMetrics.misses, 1);
});

test('Algorithm: 8-Dimensional Vector Semantic Embedding', async (t) => {
  const sampleCar = {
    name: 'Porsche 911 GT3',
    power: 510,
    acceleration: 3.4,
    safetyRating: 5,
    mileage: 9,
    price: 25000000,
    seatingCapacity: 2,
    bodyType: 'coupe',
    fuelType: 'petrol',
    transmission: 'automatic',
    features: ['Roll cage', 'Aero wing', 'Launch control', 'Carbon ceramic brakes'],
  };

  const vector = encodeCarVector(sampleCar);
  assert.equal(vector.length, 8);
  assert.ok(vector[0] > 0.8, 'High performance car should have speed dimension > 0.8');

  // Test cosine similarity of identical vectors
  const cosSame = cosineSimilarity(vector, vector);
  assert.ok(Math.abs(cosSame - 1.0) < 0.001, 'Cosine similarity of identical vectors should be 1.0');

  // Test cosine similarity of orthogonal / contrasting queries
  const speedQueryVec = encodeQueryVector('super fast track racing speed');
  const budgetQueryVec = encodeQueryVector('cheap economy low cost mileage');

  const speedScore = cosineSimilarity(speedQueryVec, vector);
  const budgetScore = cosineSimilarity(budgetQueryVec, vector);

  assert.ok(
    speedScore > budgetScore,
    `Porsche should score higher on speed (${speedScore.toFixed(3)}) than budget (${budgetScore.toFixed(3)})`
  );
});

test('Algorithm: 5D Automotive DNA Vector Calculator', async (t) => {
  const evCar = {
    name: 'Tata Nexon EV',
    power: 143,
    acceleration: 8.9,
    safetyRating: 5,
    mileage: 320,
    fuelType: 'electric',
    seatingCapacity: 5,
    bodyType: 'suv',
    price: 1700000,
    features: ['Regen braking', 'Connected car', '6 Airbags', 'Touchscreen'],
  };

  const dna = calculateCarDna(evCar);
  assert.ok(dna.economy >= 95, 'EV should score 95+ in Economy');
  assert.ok(dna.safety >= 80, '5-star rated car should score 80+ in Safety');
  assert.ok(dna.practicality >= 70, '5-seater SUV should score 70+ in Practicality');
});

test('Security & Reliability: Sliding Window Rate Limiter', async (t) => {
  const limiter = createRateLimiter({
    windowMs: 1000,
    maxRequests: 3,
  });

  const req = {
    headers: { 'x-forwarded-for': '192.168.1.100' },
    socket: {},
  };

  let statusCode = 200;
  const mockRes = () => {
    const headers = {};
    return {
      setHeader: (k, v) => {
        headers[k] = v;
      },
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => body,
        };
      },
    };
  };

  let nextCalls = 0;
  const next = () => {
    nextCalls++;
  };

  // 1st request
  limiter(req, mockRes(), next);
  assert.equal(nextCalls, 1);

  // 2nd request
  limiter(req, mockRes(), next);
  assert.equal(nextCalls, 2);

  // 3rd request
  limiter(req, mockRes(), next);
  assert.equal(nextCalls, 3);

  // 4th request -> should trigger 429
  limiter(req, mockRes(), next);
  assert.equal(nextCalls, 3, 'Next should not be called when rate limited');
  assert.equal(statusCode, 429, 'HTTP Status should be 429 Too Many Requests');
});

import queryCache from '../utils/cacheManager.js';

/**
 * 8-Dimensional Vector Semantic Embedding & Cosine Similarity Engine
 * Production AI/Math algorithm for sub-millisecond semantic search.
 */

// Normalized 8D vector indices:
// 0: Speed & Raw Power
// 1: NCAP Safety & Stability
// 2: Efficiency & Mileage
// 3: Luxury & Craftsmanship
// 4: Cabin Space & Family Practicality
// 5: Urban Agility & Maneuverability
// 6: Highway Grand Touring Endurance
// 7: Infotainment & ADAS Tech Quotient

export const encodeCarVector = (car) => {
  const power = Number(car.power || 120);
  const accel = Number(car.acceleration || 10);
  const safety = Number(car.safetyRating || 4);
  const mileage = Number(car.mileage || 15);
  const price = Number(car.price || 1500000);
  const seats = Number(car.seatingCapacity || 5);
  const isEV = car.fuelType?.toLowerCase() === 'electric';
  const isHybrid = car.fuelType?.toLowerCase() === 'hybrid';
  const isAutomatic = car.transmission?.toLowerCase() === 'automatic';
  const featuresCount = car.features?.length || 4;

  const normalize = (val, min, max) => Math.max(0, Math.min(1, (val - min) / (max - min)));

  // 1. Speed
  const vSpeed = normalize(power, 90, 320) * 0.6 + (1 - normalize(accel, 4, 13)) * 0.4;
  // 2. Safety
  const vSafety = normalize(safety, 2, 5) * 0.8 + (car.features?.some(f => /airbag|abs|safety|camera/i.test(f)) ? 0.2 : 0.05);
  // 3. Efficiency
  const vEconomy = isEV ? 0.98 : isHybrid ? 0.90 : normalize(mileage, 10, 26);
  // 4. Luxury
  const vLuxury = normalize(price, 800000, 6000000) * 0.7 + normalize(featuresCount, 2, 8) * 0.3;
  // 5. Practicality
  const vPractical = (seats >= 7 ? 0.95 : seats >= 5 ? 0.75 : 0.45) + (car.bodyType === 'suv' ? 0.15 : 0.05);
  // 6. Urban Agility
  const vAgility = (car.bodyType === 'hatchback' ? 0.95 : car.bodyType === 'sedan' ? 0.7 : 0.5) + (isAutomatic ? 0.1 : 0);
  // 7. Highway Touring
  const vTouring = normalize(power, 100, 300) * 0.5 + normalize(price, 1000000, 5000000) * 0.3 + (car.fuelType === 'diesel' ? 0.2 : 0.1);
  // 8. Tech Quotient
  const vTech = normalize(featuresCount, 2, 10) * 0.7 + (isEV ? 0.3 : 0.1);

  return [
    Number(vSpeed.toFixed(3)),
    Number(vSafety.toFixed(3)),
    Number(vEconomy.toFixed(3)),
    Number(vLuxury.toFixed(3)),
    Number(Math.min(1, vPractical).toFixed(3)),
    Number(Math.min(1, vAgility).toFixed(3)),
    Number(Math.min(1, vTouring).toFixed(3)),
    Number(Math.min(1, vTech).toFixed(3)),
  ];
};

export const encodeQueryVector = (queryText = '') => {
  const q = queryText.toLowerCase();

  let vSpeed = 0.5;
  let vSafety = 0.5;
  let vEconomy = 0.5;
  let vLuxury = 0.5;
  let vPractical = 0.5;
  let vAgility = 0.5;
  let vTouring = 0.5;
  let vTech = 0.5;

  // Semantic intent mapping
  if (/fast|speed|quick|rapid|acceleration|power|performance|sport|track|thrust|punchy/i.test(q)) {
    vSpeed = 0.95;
    vTouring += 0.2;
  }
  if (/safe|safety|crash|family|ncap|airbag|protection|reliable|kids|children/i.test(q)) {
    vSafety = 0.98;
    vPractical += 0.25;
  }
  if (/mileage|cheap|budget|economy|efficient|low running|cng|petrol saver|commute/i.test(q)) {
    vEconomy = 0.95;
    vLuxury -= 0.2;
  }
  if (/electric|ev|battery|hybrid|clean|green|zero emission/i.test(q)) {
    vEconomy = 0.95;
    vTech = 0.9;
  }
  if (/luxury|executive|premium|comfort|quiet|leather|plush|vip|expensive|chauffeured/i.test(q)) {
    vLuxury = 0.95;
    vTouring += 0.2;
    vEconomy -= 0.15;
  }
  if (/spacious|7-seater|7 seater|luggage|large family|boot|big|suv/i.test(q)) {
    vPractical = 0.95;
  }
  if (/city|traffic|compact|parking|hatchback|easy to drive|agile/i.test(q)) {
    vAgility = 0.95;
    vEconomy += 0.15;
  }
  if (/highway|road trip|long drive|expressway|overtaking|touring/i.test(q)) {
    vTouring = 0.95;
    vSpeed += 0.15;
  }
  if (/tech|sunroof|adas|touchscreen|ventilated|modern|smart/i.test(q)) {
    vTech = 0.95;
  }

  const clamp = (val) => Math.max(0.1, Math.min(1.0, Number(val.toFixed(3))));

  return [
    clamp(vSpeed),
    clamp(vSafety),
    clamp(vEconomy),
    clamp(vLuxury),
    clamp(vPractical),
    clamp(vAgility),
    clamp(vTouring),
    clamp(vTech),
  ];
};

/**
 * Cosine Similarity: (A • B) / (||A|| * ||B||)
 */
export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Execute Semantic Vector Search over automotive catalogue
 */
export const searchByVector = (queryText, cars = [], topK = 5) => {
  const cacheKey = queryCache.generateKey('semantic-vector', queryText);
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }

  const startTime = Date.now();
  const queryVec = encodeQueryVector(queryText);

  const scored = cars.map((car) => {
    const carVec = encodeCarVector(car);
    const similarity = cosineSimilarity(queryVec, carVec);

    return {
      car: car.toObject ? car.toObject() : car,
      similarityScore: Number(similarity.toFixed(4)),
      matchPercentage: Math.round(similarity * 100),
      vectorEmbeddings: {
        query: queryVec,
        car: carVec,
      },
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  const results = scored.slice(0, topK);
  const latencyMs = Date.now() - startTime;

  const payload = {
    query: queryText,
    dimensions: 8,
    metric: 'Cosine Distance (Dot Product Normalization)',
    latencyMs,
    results,
    fromCache: false,
  };

  queryCache.set(cacheKey, payload, 300, latencyMs);
  return payload;
};

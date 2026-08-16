import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const extractWords = (text) =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

const buildLocalRecommendations = (query, availableCars) => {
  const queryWords = extractWords(query);

  const scoredCars = availableCars.map((car) => {
    const haystack = [
      car.name,
      car.brand,
      car.model,
      car.bodyType,
      car.fuelType,
      car.transmission,
      ...(car.features || []),
    ]
      .filter(Boolean)
      .map((value) => value.toString().toLowerCase())
      .join(' ');

    let score = 0;
    queryWords.forEach((word) => {
      if (haystack.includes(word)) score += 10;
    });

    if (/budget|cheap|economy|affordable|low cost/.test(query.toLowerCase())) {
      score += car.price < 2000000 ? 20 : 0;
    }
    if (/luxury|premium|best|top|powerful|performance/.test(query.toLowerCase())) {
      score += car.price > 3000000 ? 20 : 0;
    }
    if (/electric|ev/.test(query.toLowerCase())) {
      score += car.fuelType === 'electric' ? 20 : 0;
    }
    if (/hybrid/.test(query.toLowerCase())) {
      score += car.fuelType === 'hybrid' ? 20 : 0;
    }
    if (/suv|crossover|off[- ]road/.test(query.toLowerCase())) {
      score += car.bodyType === 'suv' ? 20 : 0;
    }
    if (/sedan|saloon/.test(query.toLowerCase())) {
      score += car.bodyType === 'sedan' ? 20 : 0;
    }
    if (/manual/.test(query.toLowerCase())) {
      score += car.transmission === 'manual' ? 15 : 0;
    }
    if (/automatic/.test(query.toLowerCase())) {
      score += car.transmission === 'automatic' ? 15 : 0;
    }

    return { car, score };
  });

  const topCars = scoredCars
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ car }) => ({
      name: car.name,
      brand: car.brand,
      reason: `This ${car.bodyType} is a strong match for your request because it offers ${car.fuelType} power with ${car.transmission} transmission and includes ${car.features?.slice(0, 2).join(', ')}.`,
    }));

  return {
    recommendations: topCars,
    summary: `These cars were selected from the database as the best matches for your query: "${query}".`,
  };
};

const buildLocalComparison = (car1, car2) => {
  const score = (car) => {
    let value = 0;
    value += car.power * 0.4;
    value += car.mileage * 0.3;
    value += (car.safetyRating || 4) * 10;
    value -= car.price / 100000;
    return value;
  };

  const comparison = {
    performance: car1.power === car2.power
      ? 'Both cars deliver similar performance for their segments.'
      : `${car1.power > car2.power ? car1.name : car2.name} has the stronger engine and quicker acceleration compared to the other car.`,
    comfort: car1.seatingCapacity === car2.seatingCapacity
      ? 'Both cars offer similar seating capacity and comfort features.'
      : `${car1.seatingCapacity > car2.seatingCapacity ? car1.name : car2.name} offers more passenger capacity, making it better for families or larger groups.`,
    mileage: car1.mileage === car2.mileage
      ? 'Both cars offer comparable efficiency for city and highway use.'
      : `${car1.mileage > car2.mileage ? car1.name : car2.name} has the better fuel economy, which makes it more efficient for daily driving.`,
    safety: `${car1.name} has a safety rating of ${car1.safetyRating}, while ${car2.name} has a safety rating of ${car2.safetyRating}. Choose the one with the higher rating for stronger safety confidence.`,
    maintenanceCost: `${car1.price < car2.price ? car1.name : car2.name} is likely cheaper to maintain based on its lower listed price.`,
    cityDriving: car1.bodyType === 'hatchback' || car1.fuelType === 'electric'
      ? `${car1.name} is easier to maneuver in the city and likely more economical for urban use. `
      : `${car2.name} is a strong city choice thanks to its compact layout and efficient powertrain.`,
    highwayDriving: car1.power > car2.power
      ? `${car1.name} is better suited for highway cruising and overtaking with its stronger engine.`
      : `${car2.name} is likely more comfortable and composed at highway speeds.`,
    prosOfCar1: [
      car1.power > car2.power ? 'Stronger engine output' : 'Good engine balance',
      car1.mileage > car2.mileage ? 'Better fuel efficiency' : 'Comfortable ride quality',
      car1.safetyRating >= car2.safetyRating ? 'Comparable or better safety rating' : 'Balanced feature package',
    ],
    consOfCar1: [
      car1.price > car2.price ? 'Higher purchase price' : 'Slightly less power than the competitor',
      car1.mileage < car2.mileage ? 'Lower fuel efficiency' : 'Smaller boot space',
      car1.safetyRating < car2.safetyRating ? 'Lower safety rating' : 'Higher running cost relative to budget models',
    ],
    prosOfCar2: [
      car2.power > car1.power ? 'Stronger engine output' : 'Good overall balance',
      car2.mileage > car1.mileage ? 'Better fuel efficiency' : 'Good interior comfort',
      car2.safetyRating >= car1.safetyRating ? 'Strong safety rating' : 'Easy city usability',
    ],
    consOfCar2: [
      car2.price > car1.price ? 'Higher purchase price' : 'Slightly less power than the competitor',
      car2.mileage < car1.mileage ? 'Lower fuel efficiency' : 'More expensive maintenance expectation',
      car2.safetyRating < car1.safetyRating ? 'Lower safety rating' : 'Less cargo flexibility',
    ],
    finalRecommendation: score(car1) >= score(car2)
      ? `${car1.name} is the better overall option for most buyers based on its balanced mix of performance, efficiency, and safety.`
      : `${car2.name} is the better overall choice for most buyers based on its stronger economy and comfort features.`,
    bestFor: {
      car1: `${car1.price < car2.price ? 'budget-conscious buyers and those seeking good overall value' : 'buyers looking for stronger performance and higher safety ratings'}`,
      car2: `${car2.price < car1.price ? 'budget-conscious buyers and those seeking good overall value' : 'buyers looking for more efficient highway or city driving'}`,
    },
  };

  return comparison;
};

export const getCarRecommendations = async (userQuery, availableCars) => {
  if (!userQuery || !userQuery.trim()) {
    throw new Error('Query is required for recommendations');
  }

  if (!openai) {
    return buildLocalRecommendations(userQuery, availableCars);
  }

  try {
    const carListText = availableCars
      .map(
        (car) =>
          `- ${car.name} (${car.brand} ${car.model}): ₹${car.priceDisplay}, ${car.fuelType}, ${car.transmission}, ${car.mileage} ${car.mileageUnit}, ${car.bodyType}, ${car.features.join(', ')}`
      )
      .join('\n');

    const prompt = `You are an expert automotive consultant. Based on the user's query and the available cars listed below, recommend 3-5 cars from the database that best match their needs.

User Query: "${userQuery}"

Available Cars:
${carListText}

For each recommended car, provide:
1. Car name and brand
2. Exact price from database (₹ format)
3. Why it matches their needs (1-2 sentences)

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "name": "car name",
      "brand": "brand",
      "reason": "why this car is perfect for them"
    }
  ],
  "summary": "brief overall recommendation summary"
}`;

    const message = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = message.choices[0]?.message?.content;
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return buildLocalRecommendations(userQuery, availableCars);
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    return buildLocalRecommendations(userQuery, availableCars);
  }
};

export const getCarComparison = async (car1, car2) => {
  if (!car1 || !car2) {
    throw new Error('Two cars are required for comparison');
  }

  if (!openai) {
    return buildLocalComparison(car1, car2);
  }

  try {
    const prompt = `You are an expert automotive consultant. Compare these two cars in detail:

Car 1: ${car1.name} (${car1.brand} ${car1.model})
- Price: ₹${car1.priceDisplay}
- Fuel Type: ${car1.fuelType}
- Transmission: ${car1.transmission}
- Mileage: ${car1.mileage} ${car1.mileageUnit}
- Body Type: ${car1.bodyType}
- Features: ${car1.features.join(', ')}
- Power: ${car1.power} PS, Torque: ${car1.torque} Nm
- 0-100: ${car1.acceleration}s, Top Speed: ${car1.topSpeed} km/h

Car 2: ${car2.name} (${car2.brand} ${car2.model})
- Price: ₹${car2.priceDisplay}
- Fuel Type: ${car2.fuelType}
- Transmission: ${car2.transmission}
- Mileage: ${car2.mileage} ${car2.mileageUnit}
- Body Type: ${car2.bodyType}
- Features: ${car2.features.join(', ')}
- Power: ${car2.power} PS, Torque: ${car2.torque} Nm
- 0-100: ${car2.acceleration}s, Top Speed: ${car2.topSpeed} km/h

Provide a comprehensive comparison as JSON with this structure:
{
  "performance": "comparison of performance metrics",
  "comfort": "comparison of comfort features",
  "mileage": "comparison of fuel efficiency",
  "safety": "comparison of safety features",
  "maintenanceCost": "estimated maintenance cost comparison",
  "cityDriving": "which is better for city driving and why",
  "highwayDriving": "which is better for highway driving and why",
  "prosOfCar1": ["pro1", "pro2", "pro3"],
  "consOfCar1": ["con1", "con2", "con3"],
  "prosOfCar2": ["pro1", "pro2", "pro3"],
  "consOfCar2": ["con1", "con2", "con3"],
  "finalRecommendation": "which car is better overall and for what type of buyer",
  "bestFor": {
    "car1": "type of buyer that should choose car 1",
    "car2": "type of buyer that should choose car 2"
  }
}`;

    const message = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = message.choices[0]?.message?.content;
    const jsonMatch = responseText?.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return buildLocalComparison(car1, car2);
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('OpenAI Comparison Error:', error);
    return buildLocalComparison(car1, car2);
  }
};

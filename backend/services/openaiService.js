import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const extractWords = (text) =>
  text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

export const PERSONAS = {
  track_enthusiast: {
    id: 'track_enthusiast',
    name: 'The Apex Hunter',
    title: 'Track & Performance Specialist',
    avatar: '🏎️',
    badge: 'Performance Obsessed',
    quote: "Life's too short for lazy throttles and lifeless steering.",
    systemPrompt: 'You are "The Apex Hunter", a spirited, track-hardened automotive journalist and racing enthusiast. You evaluate cars based on throttle punch, 0-100 sprints, cornering grip, power-to-weight ratio, and transmission responsiveness. Use exciting, precise automotive vocabulary.'
  },
  safety_auditor: {
    id: 'safety_auditor',
    name: 'Guardian Sentinel',
    title: 'Family & Crash Safety Auditor',
    avatar: '🛡️',
    badge: 'Safety First',
    quote: 'Every journey begins with structural integrity and peace of mind.',
    systemPrompt: 'You are "Guardian Sentinel", an uncompromising automotive safety inspector and family advocate. You scrutinize NCAP crash safety ratings, ISOFIX mounts, ESP, active driver-assistance systems (ADAS), braking distances, and passenger survival cells.'
  },
  green_strategist: {
    id: 'green_strategist',
    name: 'Volt & Velocity',
    title: 'Clean Mobility & EV Strategist',
    avatar: '⚡',
    badge: 'Zero Emissions',
    quote: 'The future is electric, intelligent, and instant-torque.',
    systemPrompt: 'You are "Volt & Velocity", a cutting-edge sustainable transport technologist. You evaluate vehicles based on battery efficiency, regenerative braking finesse, charging curves, zero emissions, and modern tech integration.'
  },
  luxury_connoisseur: {
    id: 'luxury_connoisseur',
    name: 'Grand Tourer',
    title: 'Executive & Luxury Curator',
    avatar: '👑',
    badge: 'Prestige & Craftsmanship',
    quote: 'True luxury is whispered in cabin silence and supple leather.',
    systemPrompt: 'You are "Grand Tourer", a discerning connoisseur of luxury grand tourers and executive sedans. You prize acoustic isolation, ventilated Nappa leather, harmonic suspension dampening, road presence, and bespoke tech touches.'
  },
  pragmatic_saver: {
    id: 'pragmatic_saver',
    name: 'The Value Master',
    title: 'Total Cost & Ownership Economist',
    avatar: '💰',
    badge: 'Maximum Value',
    quote: 'Smart motoring is about highest mileage, low maintenance, and peak resale value.',
    systemPrompt: 'You are "The Value Master", a razor-sharp automotive financial advisor. You focus on real-world mileage (kmpl), low servicing costs, parts availability, resale retention, and maximum return per rupee spent.'
  }
};

export const calculateCarDna = (car) => {
  const power = Number(car.power || car.horsepower || 120);
  const accel = Number(car.acceleration || 10);
  const safety = Number(car.safetyRating || 4);
  const mileage = Number(car.mileage || 15);
  const price = Number(car.price || 1500000);
  const seats = Number(car.seatingCapacity || 5);
  const isEV = car.fuelType?.toLowerCase() === 'electric';
  const isHybrid = car.fuelType?.toLowerCase() === 'hybrid';

  const speed = Math.min(99, Math.max(30, Math.round(
    ((power / 280) * 55) + ((14 - Math.min(14, Math.max(3.5, accel))) / 10.5) * 45
  )));

  const safetyScore = Math.min(99, Math.max(40, Math.round(
    (safety / 5) * 85 + (car.features?.some(f => /airbag|abs|safety|camera|sensor/i.test(f)) ? 14 : 6)
  )));

  const economy = isEV ? 98 : isHybrid ? 92 : Math.min(96, Math.max(25, Math.round(
    (mileage / 26) * 90
  )));

  const practicality = Math.min(99, Math.max(35, Math.round(
    (seats >= 7 ? 95 : seats >= 5 ? 78 : 50) + 
    (car.bodyType === 'suv' ? 12 : car.bodyType === 'sedan' ? 8 : 4)
  )));

  const luxury = Math.min(99, Math.max(30, Math.round(
    Math.min(1, price / 4500000) * 65 + Math.min(30, (car.features?.length || 4) * 5)
  )));

  return { speed, safety: safetyScore, economy, practicality, luxury };
};

const buildLocalRecommendations = (query, availableCars, personaKey = 'track_enthusiast') => {
  const queryWords = extractWords(query);
  const persona = PERSONAS[personaKey] || PERSONAS.track_enthusiast;

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

    // Persona-weighted scoring
    if (personaKey === 'track_enthusiast') {
      if (car.power >= 160) score += 30;
      if (car.acceleration <= 10) score += 25;
      if (car.transmission === 'automatic') score += 10;
    } else if (personaKey === 'safety_auditor') {
      if (car.safetyRating >= 5) score += 35;
      else if (car.safetyRating >= 4) score += 20;
      if (car.features?.some(f => /airbag|sensor|camera|abs/i.test(f))) score += 15;
    } else if (personaKey === 'green_strategist') {
      if (car.fuelType === 'electric') score += 40;
      else if (car.fuelType === 'hybrid') score += 30;
      else if (car.mileage >= 20) score += 15;
    } else if (personaKey === 'luxury_connoisseur') {
      if (car.price >= 2500000) score += 35;
      if (car.features?.length >= 5) score += 20;
      if (car.transmission === 'automatic') score += 10;
    } else if (personaKey === 'pragmatic_saver') {
      if (car.price <= 2000000) score += 35;
      if (car.mileage >= 18) score += 25;
      if (car.fuelType === 'cng' || car.fuelType === 'hybrid') score += 15;
    }

    if (/budget|cheap|economy|affordable|low cost/.test(query.toLowerCase())) {
      score += car.price < 2000000 ? 20 : 0;
    }
    if (/luxury|premium|best|top|powerful|performance/.test(query.toLowerCase())) {
      score += car.price > 3000000 ? 20 : 0;
    }
    if (/electric|ev/.test(query.toLowerCase())) {
      score += car.fuelType === 'electric' ? 25 : 0;
    }
    if (/hybrid/.test(query.toLowerCase())) {
      score += car.fuelType === 'hybrid' ? 25 : 0;
    }
    if (/suv|crossover|off[- ]road/.test(query.toLowerCase())) {
      score += car.bodyType === 'suv' ? 20 : 0;
    }
    if (/sedan|saloon/.test(query.toLowerCase())) {
      score += car.bodyType === 'sedan' ? 20 : 0;
    }

    return { car, score };
  });

  const getPersonaReason = (car, personaKey) => {
    switch (personaKey) {
      case 'track_enthusiast':
        return `Punches out ${car.power} PS with a rapid ${car.acceleration}s 0-100 sprint. Its ${car.bodyType} poise and responsive ${car.transmission} deliver pure driving engagement.`;
      case 'safety_auditor':
        return `Backed by a reassuring ${car.safetyRating}-star safety rating and equipped with ${car.features?.slice(0, 2).join(', ')} for comprehensive occupant protection.`;
      case 'green_strategist':
        return `Operates with eco-conscious ${car.fuelType} efficiency yielding ${car.mileage} ${car.mileageUnit}, keeping environmental impact and operational costs minimal.`;
      case 'luxury_connoisseur':
        return `Presents commanding road presence in the ${car.priceDisplay} tier with a whisper-quiet cabin and curated touches like ${car.features?.slice(0, 2).join(', ')}.`;
      case 'pragmatic_saver':
        return `An unbeatable financial calculation at ${car.priceDisplay} with ${car.mileage} ${car.mileageUnit} economy and proven long-term resale value.`;
      default:
        return `A standout ${car.bodyType} offering ${car.fuelType} power, ${car.transmission} ease, and ${car.features?.slice(0, 2).join(', ')}.`;
    }
  };

  const topCars = scoredCars
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ car }) => ({
      name: car.name,
      brand: car.brand,
      reason: getPersonaReason(car, personaKey),
    }));

  return {
    recommendations: topCars,
    persona,
    summary: `${persona.name} analyzed your search query ("${query}") from a ${persona.title.toLowerCase()} perspective and curated these top contenders.`,
  };
};

export const getCarRecommendations = async (userQuery, availableCars, personaKey = 'track_enthusiast') => {
  if (!userQuery || !userQuery.trim()) {
    throw new Error('Query is required for recommendations');
  }

  const persona = PERSONAS[personaKey] || PERSONAS.track_enthusiast;

  if (!openai) {
    return buildLocalRecommendations(userQuery, availableCars, personaKey);
  }

  try {
    const carListText = availableCars
      .map(
        (car) =>
          `- ${car.name} (${car.brand} ${car.model}): ₹${car.priceDisplay}, ${car.fuelType}, ${car.transmission}, ${car.mileage} ${car.mileageUnit}, ${car.bodyType}, ${car.power} PS, 0-100 in ${car.acceleration}s, ${car.safetyRating}-star safety, Features: ${car.features.join(', ')}`
      )
      .join('\n');

    const prompt = `${persona.systemPrompt}
You are evaluating vehicles based on user query: "${userQuery}".

Available Cars from Database:
${carListText}

Recommend 3 to 5 cars from the list that best match their request according to your distinct persona criteria. For each recommendation, provide:
1. Car name and brand
2. Why it matches their needs (1-2 sentences written strictly in your persona's voice and tone)

Format response as JSON:
{
  "recommendations": [
    {
      "name": "car name",
      "brand": "brand",
      "reason": "explanation in your persona's voice"
    }
  ],
  "summary": "1-2 sentence overview written in your persona's distinct voice"
}`;

    const message = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: persona.systemPrompt,
        },
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
      return buildLocalRecommendations(userQuery, availableCars, personaKey);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    parsed.persona = persona;
    return parsed;
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    return buildLocalRecommendations(userQuery, availableCars, personaKey);
  }
};

export const getDnaMatch = async (answers = {}, availableCars = [], personaKey = 'track_enthusiast') => {
  const persona = PERSONAS[personaKey] || PERSONAS.track_enthusiast;

  // Calculate target user DNA based on quiz inputs
  let speed = 50;
  let safety = 50;
  let economy = 50;
  let practicality = 50;
  let luxury = 50;

  const { terrain, passengers, priority, budget } = answers;

  if (terrain === 'city') {
    economy += 25;
    practicality += 15;
    speed -= 10;
  } else if (terrain === 'highway') {
    safety += 20;
    luxury += 15;
    speed += 15;
  } else if (terrain === 'mountain') {
    speed += 30;
    luxury += 10;
    economy -= 10;
  } else if (terrain === 'offroad') {
    practicality += 25;
    safety += 20;
    economy -= 10;
  }

  if (passengers === 'solo') {
    speed += 20;
    luxury += 10;
    practicality -= 15;
  } else if (passengers === 'family') {
    practicality += 30;
    safety += 25;
    speed -= 10;
  } else if (passengers === 'executive') {
    luxury += 35;
    safety += 15;
    economy -= 10;
  } else if (passengers === 'adventure') {
    practicality += 25;
    economy += 15;
  }

  if (priority === 'speed') speed = Math.max(speed, 92);
  else if (priority === 'safety') safety = Math.max(safety, 95);
  else if (priority === 'economy') economy = Math.max(economy, 94);
  else if (priority === 'luxury') luxury = Math.max(luxury, 95);

  if (budget === 'under_15') {
    economy += 15;
    luxury -= 20;
  } else if (budget === '15_30') {
    luxury += 10;
    economy += 5;
  } else if (budget === '30_60') {
    luxury += 25;
    speed += 10;
  } else if (budget === 'above_60') {
    luxury += 40;
    speed += 20;
    economy -= 15;
  }

  const clamp = (val) => Math.min(99, Math.max(25, Math.round(val)));
  const userDna = {
    speed: clamp(speed),
    safety: clamp(safety),
    economy: clamp(economy),
    practicality: clamp(practicality),
    luxury: clamp(luxury),
  };

  // Score each vehicle in the catalog against userDna
  const scoredCars = availableCars.map((car) => {
    const carDna = calculateCarDna(car);
    const diff = Math.sqrt(
      Math.pow(userDna.speed - carDna.speed, 2) +
      Math.pow(userDna.safety - carDna.safety, 2) +
      Math.pow(userDna.economy - carDna.economy, 2) +
      Math.pow(userDna.practicality - carDna.practicality, 2) +
      Math.pow(userDna.luxury - carDna.luxury, 2)
    );

    const matchPercentage = Math.round(Math.max(68, Math.min(99, 100 - diff / 2.6)));

    return {
      car,
      carDna,
      matchPercentage,
    };
  });

  scoredCars.sort((a, b) => b.matchPercentage - a.matchPercentage);
  const topMatch = scoredCars[0];
  const runnerUps = scoredCars.slice(1, 4);

  // Generate Persona Critique
  let personaReview = '';
  const topCar = topMatch.car;

  if (openai) {
    try {
      const prompt = `You are "${persona.name}" (${persona.title}). Your personality: ${persona.systemPrompt}.
A user completed the Automotive DNA Quiz.
User Target DNA: Speed: ${userDna.speed}%, Safety: ${userDna.safety}%, Economy: ${userDna.economy}%, Practicality: ${userDna.practicality}%, Luxury: ${userDna.luxury}%.
Their #1 Matched Car is ${topCar.name} (${topCar.brand} ${topCar.model}) with a ${topMatch.matchPercentage}% match.
Car DNA: Speed: ${topMatch.carDna.speed}%, Safety: ${topMatch.carDna.safety}%, Economy: ${topMatch.carDna.economy}%, Practicality: ${topMatch.carDna.practicality}%, Luxury: ${topMatch.carDna.luxury}%.

In 2-3 engaging, charismatic sentences in your distinct persona voice, give your personalized critique on why this car is their exact automotive soulmate.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      personaReview = response.choices[0]?.message?.content?.trim() || '';
    } catch (e) {
      // Fallback to local
    }
  }

  if (!personaReview) {
    const templates = {
      track_enthusiast: `With a ${topMatch.matchPercentage}% DNA affinity, the ${topCar.name} delivers the dynamic throttle bite and chassis poise you've been craving. Its ${topCar.power || 160} PS powertrain provides immediate thrust, ensuring every straight and corner exit feels electric.`,
      safety_auditor: `Scoring an exceptional ${topMatch.matchPercentage}% match on your profile, the ${topCar.name} checks all crucial structural safety boxes. Its ${topCar.safetyRating || 5}-star safety credentials and reassuring active stability systems will keep your passengers protected in every scenario.`,
      green_strategist: `Achieving a ${topMatch.matchPercentage}% compatibility rating, the ${topCar.name} is a triumph of forward-looking engineering. Its ${topCar.fuelType || 'efficient'} powertrain and ${topCar.mileage || 18} ${topCar.mileageUnit || 'kmpl'} efficiency drastically slash your operational footprint while keeping daily running costs rock bottom.`,
      luxury_connoisseur: `Rated at a prestigious ${topMatch.matchPercentage}% match, the ${topCar.name} surrounds you with acoustic isolation and distinguished craftsmanship. From its elevated road presence to its meticulously appointed cabin, it fulfills your executive expectations with effortless grace.`,
      pragmatic_saver: `At a ${topMatch.matchPercentage}% DNA score, the ${topCar.name} is the smartest balance of upfront capital and lifetime value. Its low running cost, stellar ${topCar.mileage || 18} ${topCar.mileageUnit || 'kmpl'} economy, and bulletproof serviceability make it a financial masterstroke.`
    };
    personaReview = templates[personaKey] || templates.track_enthusiast;
  }

  return {
    userDna,
    persona,
    topMatch: {
      ...topMatch.car.toObject?.() || topMatch.car,
      carDna: topMatch.carDna,
      matchPercentage: topMatch.matchPercentage,
      personaReview,
    },
    runnerUps: runnerUps.map((item) => ({
      ...item.car.toObject?.() || item.car,
      carDna: item.carDna,
      matchPercentage: item.matchPercentage,
    })),
  };
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
      model: 'gpt-4o-mini',
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

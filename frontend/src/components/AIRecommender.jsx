import React, { useState } from 'react';
import { useCarStore } from '../services/store';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import RadarChart from './RadarChart';
import {
  Sparkles,
  Search,
  Loader,
  ArrowRight,
  Zap,
  Gauge,
  Droplet,
  Scale,
  Star,
  CheckCircle2,
  Shield,
  ShieldCheck,
  TrendingUp,
  Cpu,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Award,
  ChevronRight,
  Heart,
  Volume2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PERSONAS_DATA = [
  {
    id: 'track_enthusiast',
    name: 'The Apex Hunter',
    title: 'Track & Performance Specialist',
    avatar: '🏎️',
    badge: 'Performance Obsessed',
    quote: "Life's too short for lazy throttles and lifeless steering.",
    color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-700',
    accent: 'bg-red-600',
    prompts: [
      '🏎️ Fastest accelerating sedan under 40 Lakh with sport mode',
      '⚡ Punchy turbo-petrol SUV with sharp handling and high torque',
      '🏁 Best manual rear-wheel drive car for weekend track days',
    ],
  },
  {
    id: 'safety_auditor',
    name: 'Guardian Sentinel',
    title: 'Family & Crash Safety Auditor',
    avatar: '🛡️',
    badge: 'Safety First',
    quote: 'Every journey begins with structural integrity and peace of mind.',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-700',
    accent: 'bg-blue-600',
    prompts: [
      '🛡️ 5-star NCAP rated family SUV with 6+ airbags and ISOFIX',
      '👨‍👩‍👧‍👦 Spacious 7-seater with ADAS emergency braking for highway safety',
      '🌧️ Best vehicle with all-wheel drive for rain and slippery conditions',
    ],
  },
  {
    id: 'green_strategist',
    name: 'Volt & Velocity',
    title: 'Clean Mobility & EV Strategist',
    avatar: '⚡',
    badge: 'Zero Emissions',
    quote: 'The future is electric, intelligent, and instant-torque.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-700',
    accent: 'bg-emerald-600',
    prompts: [
      '🔋 Best long-range Electric Vehicle under 25 Lakh',
      '🌿 Efficient strong-hybrid with over 22 kmpl city economy',
      '⚡ High-tech EV with regenerative braking and rapid DC charging',
    ],
  },
  {
    id: 'luxury_connoisseur',
    name: 'Grand Tourer',
    title: 'Executive & Luxury Curator',
    avatar: '👑',
    badge: 'Prestige & Craftsmanship',
    quote: 'True luxury is whispered in cabin silence and supple leather.',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-700',
    accent: 'bg-amber-600',
    prompts: [
      '👑 Executive sedan with whisper-quiet cabin and ventilated leather',
      '✨ Premium flagship SUV with panoramic roof and ambient lounge lighting',
      '🍷 Smooth automatic cruiser designed for effortless chauffeured travel',
    ],
  },
  {
    id: 'pragmatic_saver',
    name: 'The Value Master',
    title: 'Total Cost & Ownership Economist',
    avatar: '💰',
    badge: 'Maximum Value',
    quote: 'Smart motoring is highest mileage, low maintenance, and peak resale value.',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-700',
    accent: 'bg-purple-600',
    prompts: [
      '💰 Highest mileage practical car under 12 Lakh with low servicing costs',
      '📈 Best resale value automatic hatchback for congested daily commutes',
      '🔧 Lowest cost-per-kilometer car with widespread dealership support',
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 'terrain',
    title: 'Where do you log 80% of your wheel time?',
    subtitle: 'Your primary driving playground sets your powertrain priority.',
    options: [
      { id: 'city', icon: '🏙️', label: 'Urban Gridlock & Commutes', desc: 'Stop-and-go city traffic, tight parking, fuel priority' },
      { id: 'highway', icon: '🛣️', label: 'High-Speed Expressways', desc: 'Long-distance touring, high stability, overtaking punch' },
      { id: 'mountain', icon: '⛰️', label: 'Mountain Twisties & Curves', desc: 'Sharp cornering poise, strong torque, steering feel' },
      { id: 'offroad', icon: '🌲', label: 'Rough Roads & Trails', desc: 'High ground clearance, rugged suspension, tough chassis' },
    ],
  },
  {
    id: 'passengers',
    title: 'Who is your standard passenger crew?',
    subtitle: 'Space architecture is shaped around your entourage.',
    options: [
      { id: 'solo', icon: '🏎️', label: 'Solo Pilot or Duo', desc: 'Cockpit focus, sporty agility, luggage for two' },
      { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Family with Kids & Strollers', desc: 'Rear passenger AC, 5 to 7 seats, vast boot space' },
      { id: 'executive', icon: '💼', label: 'Executive & VIP Guests', desc: 'Plush legroom, reclined seats, acoustic isolation' },
      { id: 'adventure', icon: '🏕️', label: 'Outdoor Gear & Pets', desc: 'Spill-resistant cabin, roof rails, foldable seating' },
    ],
  },
  {
    id: 'priority',
    title: 'What is your single non-negotiable superpower?',
    subtitle: 'Pick the DNA attribute that matters most.',
    options: [
      { id: 'speed', icon: '⚡', label: 'Blistering Acceleration & Thrills', desc: 'Low 0-100 time, aggressive torque, visceral rev sound' },
      { id: 'safety', icon: '🛡️', label: '5-Star NCAP Crash Fortress', desc: 'Rigid survival cell, ADAS driver assistance, 6+ airbags' },
      { id: 'economy', icon: '🌿', label: 'Low Running Cost & High Mileage', desc: '20+ kmpl efficiency or zero-emissions electric charging' },
      { id: 'luxury', icon: '👑', label: 'Bespoke Comfort & Whisper Quietness', desc: 'Supple Nappa leather, ventilated seats, premium sound' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your target investment window?',
    subtitle: 'Defines your realistic price bracket and feature density.',
    options: [
      { id: 'under_15', icon: '🏷️', label: 'Under ₹15 Lakh', desc: 'Smart value, compact dimensions, economical maintenance' },
      { id: '15_30', icon: '💎', label: '₹15 - ₹30 Lakh', desc: 'Mid-range luxury, turbocharged power, ADAS tech' },
      { id: '30_60', icon: '🚀', label: '₹30 - ₹60 Lakh', desc: 'Premium executive SUVs & sedans with high performance' },
      { id: 'above_60', icon: '👑', label: '₹60+ Lakh Luxury Flagships', desc: 'Ultra-luxury appointments, blistering power, status' },
    ],
  },
];

export const AIRecommender = ({ onViewDetails, onViewTco }) => {
  const {
    recommendations,
    recommendationSummary,
    recommendationPersona,
    recommendationLoading,
    getRecommendations,
    selectedPersona,
    setSelectedPersona,
    toggleCarSelection,
    selectedCars,
    dnaResult,
    dnaLoading,
    fetchDnaMatch,
    clearDnaResult,
  } = useCarStore();

  const [activeTab, setActiveTab] = useState('persona'); // 'persona' | 'dna'
  const [query, setQuery] = useState('');

  // DNA Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    terrain: 'highway',
    passengers: 'family',
    priority: 'safety',
    budget: '15_30',
  });

  const activePersonaObj =
    PERSONAS_DATA.find((p) => p.id === selectedPersona) || PERSONAS_DATA[0];

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) {
      toast.error('Please describe what kind of car you are looking for');
      return;
    }
    getRecommendations(query, selectedPersona);
  };

  const handlePromptClick = (promptText) => {
    setQuery(promptText);
    getRecommendations(promptText, selectedPersona);
  };

  const handleQuizSelect = (questionId, optionId) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep((prev) => prev + 1);
    }
  };

  const handleRunDnaMatch = () => {
    fetchDnaMatch(quizAnswers, selectedPersona);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white py-20 px-4 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 backdrop-blur-md mb-4 shadow-inner">
            <Sparkles className="h-4 w-4 text-blue-400 animate-spin" />
            <span>AI Automotive Intelligence Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Meet Your Next-Gen Automotive Advisor
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-300">
            Consult with specialized AI personas or sequence your 5-dimensional Automotive DNA to uncover your ultimate vehicle match.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 inline-flex items-center rounded-2xl border border-gray-800 bg-gray-900/90 p-1.5 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setActiveTab('persona')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'persona'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>AI Persona Consultant</span>
            </button>
            <button
              onClick={() => setActiveTab('dna')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dna'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Automotive DNA Matcher</span>
            </button>
          </div>
        </div>

        {/* ================= TAB 1: AI PERSONA ADVISOR ================= */}
        {activeTab === 'persona' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Persona Selection Carousel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Select Automotive Persona:
                </span>
                <span className="text-xs text-blue-400 font-semibold">
                  Active Voice: {activePersonaObj.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {PERSONAS_DATA.map((persona) => {
                  const isSelected = selectedPersona === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      className={`text-left rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden group ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-b from-blue-900/30 to-gray-900 ring-2 ring-blue-500/40 shadow-xl'
                          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-800/80 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{persona.avatar}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-800 text-gray-400 group-hover:text-gray-200'
                          }`}
                        >
                          {persona.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{persona.name}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                        {persona.title}
                      </p>
                      <p className="text-[11px] text-gray-400/80 italic mt-2 line-clamp-2">
                        "{persona.quote}"
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Persona Banner */}
            <div className="max-w-4xl mx-auto rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-gray-900 to-indigo-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left backdrop-blur-md">
              <div className="h-12 w-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl shrink-0">
                {activePersonaObj.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-extrabold text-white">{activePersonaObj.name}</h4>
                  <span className="text-xs text-blue-400 font-semibold">• {activePersonaObj.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 italic mt-0.5">
                  "{activePersonaObj.quote}"
                </p>
              </div>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto rounded-2xl border border-gray-700 bg-gray-900/90 p-2.5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask ${activePersonaObj.name}... e.g. "Spacious 7-seater SUV under 25 Lakh"`}
                    className="w-full rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base outline-none placeholder:text-gray-500 bg-transparent text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recommendationLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {recommendationLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Consulting {activePersonaObj.name}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Ask Consultant</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Persona-specific Suggested Prompts */}
            <div className="max-w-4xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5 text-center sm:text-left">
                Suggested prompts for {activePersonaObj.name}:
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {activePersonaObj.prompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(promptText)}
                    className="rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2 text-xs font-medium text-gray-300 shadow-sm transition-all hover:border-blue-500/50 hover:bg-blue-900/20 hover:text-white"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Skeleton */}
            {recommendationLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto py-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-sm animate-pulse space-y-4"
                  >
                    <div className="h-48 rounded-xl bg-gray-800" />
                    <div className="h-5 w-3/4 rounded bg-gray-800" />
                    <div className="h-4 w-1/2 rounded bg-gray-800" />
                    <div className="h-16 rounded-xl bg-gray-800/60" />
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations Output */}
            {!recommendationLoading && recommendations.length > 0 && (
              <div className="max-w-6xl mx-auto space-y-6 pt-4">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activePersonaObj.avatar}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{activePersonaObj.name}'s Recommended Fleet</span>
                        <span className="text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5">
                          {recommendations.length} Matches
                        </span>
                      </h3>
                      {recommendationSummary && (
                        <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                          {recommendationSummary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((car, index) => {
                    const isCompared = selectedCars.includes(car._id);
                    const matchScore = Math.max(88, 98 - index * 3);

                    return (
                      <div
                        key={car._id || index}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-700"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative h-48 w-full overflow-hidden bg-gray-950">
                            <img
                              src={getCarImageUrl(car)}
                              alt={car.name}
                              onError={(e) => handleImageError(e, car.bodyType)}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                            <div className="absolute top-3 right-3">
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 backdrop-blur-md px-3 py-1 text-xs font-black text-white shadow-md">
                                <Sparkles className="h-3 w-3" />
                                {matchScore}% Match
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3 text-xs text-white">
                              <span className="rounded-lg bg-black/70 px-2.5 py-1 font-semibold uppercase backdrop-blur-md border border-white/10">
                                {car.bodyType}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="mb-2">
                              <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                                {car.brand}
                              </p>
                              <h4 className="text-lg font-extrabold text-white tracking-tight">
                                {car.name}
                              </h4>
                              <p className="text-2xl font-black text-blue-400 mt-1">
                                {car.priceDisplay}
                              </p>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 gap-2 my-3 text-xs text-gray-300">
                              <div className="flex items-center gap-1.5 rounded-lg bg-gray-800/80 border border-gray-700/50 p-2">
                                <Zap className="h-3.5 w-3.5 text-blue-400" />
                                <span className="font-semibold">{car.power} PS</span>
                              </div>
                              <div className="flex items-center gap-1.5 rounded-lg bg-gray-800/80 border border-gray-700/50 p-2">
                                <Gauge className="h-3.5 w-3.5 text-blue-400" />
                                <span className="font-semibold">{car.mileage} {car.mileageUnit}</span>
                              </div>
                            </div>

                            {/* Persona Reason Box */}
                            {car.aiReason && (
                              <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-3 text-xs text-blue-200 leading-relaxed mt-3">
                                <div className="flex items-center gap-1 font-bold text-blue-400 mb-1">
                                  <span>{activePersonaObj.avatar}</span>
                                  <span>{activePersonaObj.name}'s Take:</span>
                                </div>
                                <p>{car.aiReason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-5 pt-0 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => onViewDetails?.(car)}
                              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/20"
                            >
                              Specs & EMI
                            </button>

                            <button
                              onClick={() => toggleCarSelection(car._id)}
                              className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                                isCompared
                                  ? 'bg-indigo-600 border-indigo-600 text-white'
                                  : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              {isCompared ? 'In Compare ✓' : '+ Compare'}
                            </button>
                          </div>

                          {onViewTco && (
                            <button
                              onClick={() => onViewTco(car)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 py-1.5 text-xs font-semibold transition-colors"
                            >
                              <span>5-Yr True Cost (TCO)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: AUTOMOTIVE DNA MATCHER ================= */}
        {activeTab === 'dna' && (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
            
            {/* If no result yet, show interactive questionnaire */}
            {!dnaResult && (
              <div className="rounded-3xl border border-gray-800 bg-gray-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 font-black text-xs text-white">
                      {quizStep + 1}
                    </span>
                    <span className="text-sm font-bold text-white">
                      Step {quizStep + 1} of {QUIZ_QUESTIONS.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {QUIZ_QUESTIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuizStep(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === quizStep
                            ? 'w-8 bg-purple-500'
                            : idx < quizStep
                            ? 'w-3 bg-purple-700'
                            : 'w-3 bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Question */}
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {QUIZ_QUESTIONS[quizStep].title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {QUIZ_QUESTIONS[quizStep].subtitle}
                  </p>
                </div>

                {/* Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {QUIZ_QUESTIONS[quizStep].options.map((opt) => {
                    const currentQId = QUIZ_QUESTIONS[quizStep].id;
                    const isSelected = quizAnswers[currentQId] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleQuizSelect(currentQId, opt.id)}
                        className={`text-left rounded-2xl border p-5 transition-all duration-200 relative group ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/30 ring-2 ring-purple-500/40 shadow-xl shadow-purple-500/10'
                            : 'border-gray-800 bg-gray-800/50 hover:border-gray-700 hover:bg-gray-800 text-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-3xl mb-3 block">{opt.icon}</span>
                          {isSelected && (
                            <span className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">{opt.label}</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <button
                    disabled={quizStep === 0}
                    onClick={() => setQuizStep((prev) => Math.max(0, prev - 1))}
                    className="rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Back
                  </button>

                  {quizStep < QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setQuizStep((prev) => prev + 1)}
                      className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/25 transition-all"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleRunDnaMatch}
                      disabled={dnaLoading}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-7 py-3 text-sm font-extrabold text-white shadow-xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                      {dnaLoading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Sequencing Your Car DNA...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Calculate DNA Soulmate Match</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* DNA Match Loading */}
            {dnaLoading && (
              <div className="text-center py-16 space-y-4">
                <Loader className="h-10 w-10 text-purple-500 animate-spin mx-auto" />
                <h4 className="text-xl font-black text-white">
                  Running Multi-Variable Vector Analysis...
                </h4>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Cross-referencing your speed, safety, economy, practicality, and luxury constraints against all verified database vehicles.
                </p>
              </div>
            )}

            {/* DNA Match Results Presentation */}
            {!dnaLoading && dnaResult && (
              <div className="space-y-8 animate-in fade-in duration-500">
                
                {/* Result Hero Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 border border-purple-500/30 px-3.5 py-1 text-xs font-bold text-purple-300 mb-2">
                      <Award className="h-3.5 w-3.5 text-purple-400" />
                      <span>Automotive DNA Match Confirmed</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Your Automotive Soulmate
                    </h3>
                  </div>

                  <button
                    onClick={clearDnaResult}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

                {/* Primary Match Card with Radar Chart */}
                <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: 5-Axis Spider Radar Chart */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-950/60 rounded-2xl p-6 border border-gray-800/80 shadow-inner">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                        5-Axis Telemetry Radar
                      </span>
                      <RadarChart
                        userDna={dnaResult.userDna}
                        carDna={dnaResult.topMatch.carDna}
                        carName={dnaResult.topMatch.name}
                        size={300}
                      />
                    </div>

                    {/* Right: Vehicle Details & Persona Critique */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                          {dnaResult.topMatch.brand} • {dnaResult.topMatch.bodyType}
                        </span>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 text-xs font-black text-emerald-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{dnaResult.topMatch.matchPercentage}% DNA Affinity</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          {dnaResult.topMatch.name}
                        </h4>
                        <p className="text-3xl font-black text-purple-400 mt-1">
                          {dnaResult.topMatch.priceDisplay}
                        </p>
                      </div>

                      {/* DNA Vector Stat Badges */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-gray-800/80 border border-gray-700/60 p-2">
                          <span className="text-[10px] text-gray-400 block font-semibold">Speed</span>
                          <span className="text-sm font-extrabold text-blue-400">
                            {dnaResult.topMatch.carDna.speed}%
                          </span>
                        </div>
                        <div className="rounded-xl bg-gray-800/80 border border-gray-700/60 p-2">
                          <span className="text-[10px] text-gray-400 block font-semibold">Safety</span>
                          <span className="text-sm font-extrabold text-emerald-400">
                            {dnaResult.topMatch.carDna.safety}%
                          </span>
                        </div>
                        <div className="rounded-xl bg-gray-800/80 border border-gray-700/60 p-2">
                          <span className="text-[10px] text-gray-400 block font-semibold">Economy</span>
                          <span className="text-sm font-extrabold text-cyan-400">
                            {dnaResult.topMatch.carDna.economy}%
                          </span>
                        </div>
                        <div className="rounded-xl bg-gray-800/80 border border-gray-700/60 p-2">
                          <span className="text-[10px] text-gray-400 block font-semibold">Practical</span>
                          <span className="text-sm font-extrabold text-amber-400">
                            {dnaResult.topMatch.carDna.practicality}%
                          </span>
                        </div>
                        <div className="rounded-xl bg-gray-800/80 border border-gray-700/60 p-2">
                          <span className="text-[10px] text-gray-400 block font-semibold">Luxury</span>
                          <span className="text-sm font-extrabold text-purple-400">
                            {dnaResult.topMatch.carDna.luxury}%
                          </span>
                        </div>
                      </div>

                      {/* Persona Voice Review Callout */}
                      {dnaResult.topMatch.personaReview && (
                        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/30 p-4 sm:p-5 text-xs sm:text-sm text-purple-100 leading-relaxed shadow-lg">
                          <div className="flex items-center gap-2 font-bold text-purple-300 mb-1.5">
                            <span className="text-base">{dnaResult.persona.avatar}</span>
                            <span>{dnaResult.persona.name}'s Soulmate Verdict:</span>
                          </div>
                          <p className="italic">{dnaResult.topMatch.personaReview}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={() => onViewDetails?.(dnaResult.topMatch)}
                          className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                          <span>Inspect Specs & Live EMI</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        {onViewTco && (
                          <button
                            onClick={() => onViewTco(dnaResult.topMatch)}
                            className="flex items-center gap-2 rounded-xl border border-purple-500/50 bg-purple-950/50 hover:bg-purple-900/50 px-5 py-3 text-xs sm:text-sm font-extrabold text-purple-200 transition-all hover:scale-105"
                          >
                            <span>5-Yr TCO Financial Model</span>
                          </button>
                        )}

                        <button
                          onClick={() => toggleCarSelection(dnaResult.topMatch._id)}
                          className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
                            selectedCars.includes(dnaResult.topMatch._id)
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <Scale className="h-4 w-4" />
                          <span>
                            {selectedCars.includes(dnaResult.topMatch._id)
                              ? 'In Comparison Dock ✓'
                              : 'Add to Comparison'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Runner-Up Matches */}
                {dnaResult.runnerUps?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <span>Close Contenders & Alternative Profiles</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {dnaResult.runnerUps.map((runner, idx) => (
                        <div
                          key={runner._id || idx}
                          className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4 flex flex-col justify-between hover:border-gray-700 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-gray-400 uppercase">
                                Rank #{idx + 2}
                              </span>
                              <span className="text-xs font-extrabold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
                                {runner.matchPercentage}% Match
                              </span>
                            </div>
                            <h5 className="text-base font-bold text-white truncate">
                              {runner.name}
                            </h5>
                            <p className="text-sm font-black text-purple-300 mt-0.5">
                              {runner.priceDisplay}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                              {runner.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => onViewDetails?.(runner)}
                              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              View Details →
                            </button>
                            <button
                              onClick={() => toggleCarSelection(runner._id)}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                                selectedCars.includes(runner._id)
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-700 text-gray-400 hover:text-white'
                              }`}
                            >
                              {selectedCars.includes(runner._id) ? 'Selected ✓' : '+ Compare'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommender;

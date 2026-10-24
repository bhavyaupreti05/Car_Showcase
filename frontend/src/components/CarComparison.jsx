import React, { useEffect } from 'react';
import { useCarStore } from '../services/store';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import { X, Loader, Trophy, Check, Zap, Gauge, Droplet, Star, Sparkles, Flame, AlertCircle } from 'lucide-react';

// Visual spec bar comparator (defined outside component to prevent re-instantiation)
const SpecBar = ({ label, val1, val2, unit = '', higherIsBetter = true }) => {
  const num1 = Number(val1) || 0;
  const num2 = Number(val2) || 0;
  const maxVal = Math.max(num1, num2) * 1.15 || 1;
  const pct1 = Math.min(100, (num1 / maxVal) * 100);
  const pct2 = Math.min(100, (num2 / maxVal) * 100);

  const winner1 = higherIsBetter ? num1 > num2 : num1 < num2;
  const winner2 = higherIsBetter ? num2 > num1 : num2 < num1;
  const isTie = num1 === num2;

  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-1.5">
        <div className="flex items-center gap-1">
          <span className={winner1 && !isTie ? 'text-blue-600 font-bold' : 'text-gray-900'}>
            {val1 ?? '-'} {unit}
          </span>
          {winner1 && !isTie && <Trophy className="h-3 w-3 text-amber-500 fill-amber-400" />}
        </div>
        <span className="uppercase tracking-wider text-[11px] font-bold text-gray-400">{label}</span>
        <div className="flex items-center gap-1">
          {winner2 && !isTie && <Trophy className="h-3 w-3 text-amber-500 fill-amber-400" />}
          <span className={winner2 && !isTie ? 'text-blue-600 font-bold' : 'text-gray-900'}>
            {val2 ?? '-'} {unit}
          </span>
        </div>
      </div>

      {/* Double-sided Bar */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex justify-end">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              winner1 && !isTie ? 'bg-blue-600' : 'bg-gray-400'
            }`}
            style={{ width: `${pct1}%` }}
          />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              winner2 && !isTie ? 'bg-blue-600' : 'bg-gray-400'
            }`}
            style={{ width: `${pct2}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const CarComparison = ({ car1Id, car2Id, onClose }) => {
  // 1. ALL HOOKS CALLED UNCONDITIONALLY AT TOP LEVEL
  const { comparisonData, comparisonLoading, compareCars, openDragRace, error } = useCarStore();

  useEffect(() => {
    if (car1Id && car2Id) {
      compareCars(car1Id, car2Id);
    }
  }, [car1Id, car2Id, compareCars]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 2. LOADING STATE
  if (comparisonLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-2xl max-w-sm w-full text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Comparing Vehicles...</h3>
            <p className="text-xs text-gray-500 mt-1">Analyzing specifications, power curves, safety and costs...</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. ERROR OR NO DATA FALLBACK
  if (!comparisonData || !comparisonData.car1 || !comparisonData.car2) {
    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      >
        <div className="rounded-3xl bg-white p-8 shadow-2xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Comparison Unavailable</h3>
          <p className="text-xs text-gray-500 mt-1 mb-6">
            {error || 'Unable to generate comparison for selected vehicles. Please try again.'}
          </p>
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { car1, car2, comparison = {} } = comparisonData;

  // Safe array normalization
  const pros1 = Array.isArray(comparison.prosOfCar1) ? comparison.prosOfCar1 : [];
  const cons1 = Array.isArray(comparison.consOfCar1) ? comparison.consOfCar1 : [];
  const pros2 = Array.isArray(comparison.prosOfCar2) ? comparison.prosOfCar2 : [];
  const cons2 = Array.isArray(comparison.consOfCar2) ? comparison.consOfCar2 : [];

  const bestForCar1 =
    typeof comparison.bestFor?.car1 === 'string'
      ? comparison.bestFor.car1
      : typeof comparison.bestFor === 'string'
      ? comparison.bestFor
      : 'Ideal for performance and high-speed stability';

  const bestForCar2 =
    typeof comparison.bestFor?.car2 === 'string'
      ? comparison.bestFor.car2
      : typeof comparison.bestFor === 'string'
      ? comparison.bestFor
      : 'Ideal for city usability and practical ownership';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl my-8 overflow-hidden cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs">
              VS
            </span>
            <h2 className="text-xl font-extrabold text-gray-900">
              Head-to-Head Comparison
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200/80 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Top Cars Showcase Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Car 1 Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm text-center">
              <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-xl bg-gray-950 mb-3">
                <img
                  src={getCarImageUrl(car1)}
                  alt={car1.name}
                  onError={(e) => handleImageError(e, car1.bodyType)}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {car1.brand}
                </span>
                <span className="absolute bottom-2 right-2 rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {car1.bodyType}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 truncate">{car1.name}</h3>
              <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{car1.priceDisplay}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-gray-500">
                <span className="capitalize">{car1.fuelType}</span>
                <span>•</span>
                <span className="capitalize">{car1.transmission}</span>
              </div>
            </div>

            {/* Car 2 Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm text-center">
              <div className="relative h-36 sm:h-48 w-full overflow-hidden rounded-xl bg-gray-950 mb-3">
                <img
                  src={getCarImageUrl(car2)}
                  alt={car2.name}
                  onError={(e) => handleImageError(e, car2.bodyType)}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {car2.brand}
                </span>
                <span className="absolute bottom-2 right-2 rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {car2.bodyType}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 truncate">{car2.name}</h3>
              <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{car2.priceDisplay}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-gray-500">
                <span className="capitalize">{car2.fuelType}</span>
                <span>•</span>
                <span className="capitalize">{car2.transmission}</span>
              </div>
            </div>
          </div>

          {/* Live Drag Duel Banner */}
          <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-md">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <span>Want to see who wins in a real race?</span>
                  <span className="rounded bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 uppercase">NEW</span>
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Launch the 400m Quarter-Mile Drag Strip simulation powered by real acceleration physics and engine audio!
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                openDragRace();
              }}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-rose-600/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>🏁 Launch Virtual Drag Race</span>
            </button>
          </div>

          {/* Visual Performance & Specs Benchmarks */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <h4 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Benchmark & Specifications Comparison
            </h4>
            
            <div className="space-y-1">
              <SpecBar label="Max Horsepower" val1={car1.power} val2={car2.power} unit="PS" />
              <SpecBar label="Peak Torque" val1={car1.torque} val2={car2.torque} unit="Nm" />
              <SpecBar label="0-100 km/h (Lower is faster)" val1={car1.acceleration} val2={car2.acceleration} unit="s" higherIsBetter={false} />
              <SpecBar label="Top Speed" val1={car1.topSpeed} val2={car2.topSpeed} unit="km/h" />
              <SpecBar label="Fuel Efficiency" val1={car1.mileage} val2={car2.mileage} unit={car1.mileageUnit} />
              <SpecBar label="Seating" val1={car1.seatingCapacity} val2={car2.seatingCapacity} unit="seats" />
              <SpecBar label="Safety Rating" val1={car1.safetyRating || car1.rating || 4.5} val2={car2.safetyRating || car2.rating || 4.5} unit="⭐" />
            </div>
          </div>

          {/* AI Pros and Cons Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Car 1 Pros & Cons */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">{car1.name} Insights</h4>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Advantages</p>
                <ul className="text-xs text-emerald-900 space-y-1.5">
                  {pros1.length > 0 ? (
                    pros1.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-1.5">
                      <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>Strong engine output and comfortable cabin</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Considerations</p>
                <ul className="text-xs text-rose-900 space-y-1.5">
                  {cons1.length > 0 ? (
                    cons1.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="h-4 w-4 shrink-0 text-rose-600 font-bold">✕</span>
                        <span>{con}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-1.5">
                      <span className="h-4 w-4 shrink-0 text-rose-600 font-bold">✕</span>
                      <span>Higher running cost relative to smaller models</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Car 2 Pros & Cons */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">{car2.name} Insights</h4>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Advantages</p>
                <ul className="text-xs text-emerald-900 space-y-1.5">
                  {pros2.length > 0 ? (
                    pros2.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-1.5">
                      <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>Good fuel economy and modern tech features</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Considerations</p>
                <ul className="text-xs text-rose-900 space-y-1.5">
                  {cons2.length > 0 ? (
                    cons2.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="h-4 w-4 shrink-0 text-rose-600 font-bold">✕</span>
                        <span>{con}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-1.5">
                      <span className="h-4 w-4 shrink-0 text-rose-600 font-bold">✕</span>
                      <span>Slightly less power than the competition</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Final Verdict Banner */}
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>AI Comparative Verdict</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900 mb-4 leading-relaxed">
              {comparison.finalRecommendation || 'Both vehicles offer compelling strengths depending on your priority between performance and efficiency.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-blue-100 pt-4 text-xs">
              <div className="rounded-xl bg-white p-3.5 border border-blue-100">
                <p className="font-bold text-blue-900 mb-1">Choose {car1.name} if:</p>
                <p className="text-gray-700 leading-normal">{bestForCar1}</p>
              </div>
              <div className="rounded-xl bg-white p-3.5 border border-blue-100">
                <p className="font-bold text-blue-900 mb-1">Choose {car2.name} if:</p>
                <p className="text-gray-700 leading-normal">{bestForCar2}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-gray-800 cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarComparison;

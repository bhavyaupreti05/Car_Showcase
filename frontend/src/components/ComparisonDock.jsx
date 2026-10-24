import React from 'react';
import { useCarStore } from '../services/store';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import { Scale, X, ArrowRight, Sparkles } from 'lucide-react';

export const ComparisonDock = () => {
  const {
    cars,
    selectedCars,
    compareOpen,
    dragRaceOpen,
    toggleCarSelection,
    clearSelectedCars,
    openCompareModal,
    openDragRace,
  } = useCarStore();

  if (selectedCars.length === 0 || compareOpen || dragRaceOpen) return null;

  const car1 = cars.find((c) => c._id === selectedCars[0]);
  const car2 = cars.find((c) => c._id === selectedCars[1]);

  return (
    <div className="fixed bottom-5 inset-x-0 mx-auto max-w-4xl z-50 px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="rounded-2xl border border-gray-700/70 bg-gray-900/95 p-3.5 sm:p-4 text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Indicator & slots */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Scale className="h-5 w-5" />
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              {/* Car 1 Slot */}
              {car1 && (
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-1.5 shadow-inner">
                  <img
                    src={getCarImageUrl(car1)}
                    alt={car1.name}
                    onError={(e) => handleImageError(e, car1.bodyType)}
                    className="h-8 w-12 rounded-lg object-cover"
                  />
                  <div className="text-left max-w-[110px] sm:max-w-[130px] truncate">
                    <p className="text-xs font-semibold text-white truncate">{car1.name}</p>
                    <p className="text-[11px] text-blue-400 font-medium">{car1.priceDisplay}</p>
                  </div>
                  <button
                    onClick={() => toggleCarSelection(car1._id)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <span className="text-xs font-bold text-gray-500">VS</span>

              {/* Car 2 Slot */}
              {car2 ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-1.5 shadow-inner">
                  <img
                    src={getCarImageUrl(car2)}
                    alt={car2.name}
                    onError={(e) => handleImageError(e, car2.bodyType)}
                    className="h-8 w-12 rounded-lg object-cover"
                  />
                  <div className="text-left max-w-[110px] sm:max-w-[130px] truncate">
                    <p className="text-xs font-semibold text-white truncate">{car2.name}</p>
                    <p className="text-[11px] text-blue-400 font-medium">{car2.priceDisplay}</p>
                  </div>
                  <button
                    onClick={() => toggleCarSelection(car2._id)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-700 bg-gray-800/40 px-3 py-2 text-xs text-gray-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                  <span>Select 1 more car to compare</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={clearSelectedCars}
              className="text-xs text-gray-400 hover:text-white px-2 py-1.5 transition-colors"
            >
              Clear
            </button>

            {selectedCars.length === 2 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={openDragRace}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                  <span>🏁 Drag Race</span>
                </button>

                <button
                  onClick={openCompareModal}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95"
                >
                  <span>Compare</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                disabled
                className="rounded-xl bg-gray-800 px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                Pick 2nd Car
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComparisonDock;

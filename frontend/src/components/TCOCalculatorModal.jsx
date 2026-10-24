import React, { useState, useMemo } from 'react';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import {
  X,
  Calculator,
  TrendingDown,
  Fuel,
  Wrench,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TCOCalculatorModal = ({ car, onClose }) => {
  if (!car) return null;

  const isEV = car.fuelType?.toLowerCase() === 'electric';
  const isHybrid = car.fuelType?.toLowerCase() === 'hybrid';
  const isDiesel = car.fuelType?.toLowerCase() === 'diesel';

  const price = car.price || 1500000;
  const mileage = Number(car.mileage) || (isEV ? 350 : 16);

  // User input states
  const [dailyKm, setDailyKm] = useState(35);
  const [ownershipYears, setOwnershipYears] = useState(5);
  const [fuelRate, setFuelRate] = useState(isEV ? 8.5 : isDiesel ? 92 : 102);

  // Financial Modeling Calculations
  const calculations = useMemo(() => {
    const annualKm = dailyKm * 365;
    const totalKm = annualKm * ownershipYears;

    // 1. Fuel / Charging Cost
    let annualFuelCost = 0;
    if (isEV) {
      // EV efficiency ~ 6.5 km per kWh
      const kwhNeeded = annualKm / 6.5;
      annualFuelCost = kwhNeeded * fuelRate;
    } else {
      const litersNeeded = annualKm / Math.max(8, mileage);
      annualFuelCost = litersNeeded * fuelRate;
    }
    const totalFuelCost = Math.round(annualFuelCost * ownershipYears);

    // Baseline Petrol comparison for EV savings
    const petrolEquivLiters = annualKm / 14;
    const baselinePetrolCost = Math.round(petrolEquivLiters * 102 * ownershipYears);
    const fuelSavingsVsPetrol = Math.max(0, baselinePetrolCost - totalFuelCost);

    // 2. Depreciation Retention Rates by Brand Tier & Year
    const isLuxury = price > 3000000;
    const retentionCurve = isLuxury
      ? [1.0, 0.78, 0.66, 0.55, 0.46, 0.38] // Luxury depreciates steeper
      : [1.0, 0.85, 0.76, 0.67, 0.58, 0.50]; // Mass market retains better

    const resaleValue = Math.round(price * retentionCurve[ownershipYears]);
    const depreciationLoss = price - resaleValue;

    // 3. Maintenance Index
    const baseAnnualMaintenance = isEV ? 8000 : isLuxury ? 28000 : 12000;
    // Escalates slightly with age
    let totalMaintenance = 0;
    for (let yr = 1; yr <= ownershipYears; yr++) {
      totalMaintenance += baseAnnualMaintenance * (1 + (yr - 1) * 0.12);
    }
    totalMaintenance = Math.round(totalMaintenance);

    // 4. Insurance (IDV depreciation based)
    let totalInsurance = 0;
    for (let yr = 1; yr <= ownershipYears; yr++) {
      const yearIdv = price * retentionCurve[yr - 1];
      const annualPremium = Math.max(12000, yearIdv * 0.028);
      totalInsurance += annualPremium;
    }
    totalInsurance = Math.round(totalInsurance);

    // 5. Total Cost of Ownership (True Net Cost)
    const netTco = depreciationLoss + totalFuelCost + totalMaintenance + totalInsurance;
    const costPerKm = Number((netTco / totalKm).toFixed(2));

    return {
      annualKm,
      totalKm,
      totalFuelCost,
      resaleValue,
      depreciationLoss,
      totalMaintenance,
      totalInsurance,
      netTco,
      costPerKm,
      fuelSavingsVsPetrol,
      retentionCurve,
    };
  }, [price, dailyKm, ownershipYears, fuelRate, isEV, isLuxury, mileage]);

  const formatRupees = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl text-white overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">5-Year True Cost of Ownership</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Financial Model
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Depreciation curves, energy tariffs & lifetime maintenance forecasting for{' '}
                <span className="text-white font-bold">{car.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Top Control Panel: Sliders & Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl bg-gray-950/80 border border-gray-800 p-5">
            
            {/* Daily Commute Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-300">Daily Commute</span>
                <span className="text-purple-400 font-extrabold text-sm">{dailyKm} km / day</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={dailyKm}
                onChange={(e) => setDailyKm(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                {(dailyKm * 365).toLocaleString()} km annual driving
              </span>
            </div>

            {/* Ownership Horizon Toggle */}
            <div>
              <span className="text-xs font-bold text-gray-300 block mb-2">
                Ownership Horizon
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[3, 5].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setOwnershipYears(yr)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      ownershipYears === yr
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'border-gray-800 bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {yr} Years
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Total mileage: {calculations.totalKm.toLocaleString()} km
              </span>
            </div>

            {/* Fuel / Tariff Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-300">
                  {isEV ? 'Electricity Tariff' : 'Fuel Price'}
                </span>
                <span className="text-purple-400 font-extrabold text-sm">
                  ₹{fuelRate} {isEV ? '/ kWh' : '/ Litre'}
                </span>
              </div>
              <input
                type="range"
                min={isEV ? 5 : 80}
                max={isEV ? 15 : 120}
                step={isEV ? 0.5 : 1}
                value={fuelRate}
                onChange={(e) => setFuelRate(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Vehicle mileage: {car.mileage} {car.mileageUnit}
              </span>
            </div>
          </div>

          {/* Key Metric Headline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Net True Cost of Ownership */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-gray-900 to-gray-900 p-5 shadow-lg">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400 block mb-1">
                Net {ownershipYears}-Year True Ownership Cost
              </span>
              <p className="text-3xl font-black text-white">
                {formatRupees(calculations.netTco)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 mt-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>₹{calculations.costPerKm} per km all-inclusive</span>
              </div>
            </div>

            {/* Projected Resale Value */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5 shadow-lg">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                Projected Resale at Year {ownershipYears}
              </span>
              <p className="text-3xl font-black text-emerald-400">
                {formatRupees(calculations.resaleValue)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span>
                  Depreciation Loss: {formatRupees(calculations.depreciationLoss)}
                </span>
              </div>
            </div>

            {/* Energy Expenditure & Savings */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5 shadow-lg">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                {isEV ? '⚡ Electricity Cost' : '⛽ Total Fuel Cost'}
              </span>
              <p className="text-3xl font-black text-blue-400">
                {formatRupees(calculations.totalFuelCost)}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                {isEV ? (
                  <span className="text-emerald-400 font-bold">
                    Saves {formatRupees(calculations.fuelSavingsVsPetrol)} vs Petrol!
                  </span>
                ) : (
                  <span>Over {calculations.totalKm.toLocaleString()} lifetime km</span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Expense Breakdown Progress Bars */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5 space-y-4">
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              {ownershipYears}-Year Cost Distribution Breakdown
            </h4>

            <div className="space-y-3 text-xs">
              {/* Depreciation */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    Depreciation Loss ({Math.round((calculations.depreciationLoss / calculations.netTco) * 100)}%)
                  </span>
                  <span className="font-bold text-white">{formatRupees(calculations.depreciationLoss)}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${(calculations.depreciationLoss / calculations.netTco) * 100}%` }}
                  />
                </div>
              </div>

              {/* Fuel */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Fuel className="h-3.5 w-3.5 text-blue-400" />
                    Fuel / Electricity ({Math.round((calculations.totalFuelCost / calculations.netTco) * 100)}%)
                  </span>
                  <span className="font-bold text-white">{formatRupees(calculations.totalFuelCost)}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(calculations.totalFuelCost / calculations.netTco) * 100}%` }}
                  />
                </div>
              </div>

              {/* Maintenance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-amber-400" />
                    Scheduled Maintenance & Parts ({Math.round((calculations.totalMaintenance / calculations.netTco) * 100)}%)
                  </span>
                  <span className="font-bold text-white">{formatRupees(calculations.totalMaintenance)}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${(calculations.totalMaintenance / calculations.netTco) * 100}%` }}
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Comprehensive Insurance ({Math.round((calculations.totalInsurance / calculations.netTco) * 100)}%)
                  </span>
                  <span className="font-bold text-white">{formatRupees(calculations.totalInsurance)}</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(calculations.totalInsurance / calculations.netTco) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-800 bg-gray-950/80 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            *Based on standard Indian automotive market retention indices & ARAI figures.
          </p>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `5-Year TCO for ${car.name}: Net Cost: ${formatRupees(calculations.netTco)}, Resale Value: ${formatRupees(calculations.resaleValue)}, Cost/KM: ₹${calculations.costPerKm}/km.`
              );
              toast.success('Financial summary copied to clipboard!');
            }}
            className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-purple-500/25"
          >
            Copy Financial Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default TCOCalculatorModal;

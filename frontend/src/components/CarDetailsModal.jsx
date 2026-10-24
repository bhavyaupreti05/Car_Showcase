import React, { useState } from 'react';
import { getCarImageUrl, handleImageError } from '../utils/carImages';
import { useCarStore } from '../services/store';
import {
  X,
  Zap,
  Gauge,
  Droplet,
  Users,
  ShieldCheck,
  Calculator,
  Heart,
  Scale,
  Check,
  Star,
  Compass,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import EngineRevSoundbox from './EngineRevSoundbox';

export const CarDetailsModal = ({ car, onClose, onOpenTco }) => {
  if (!car) return null;

  const { garage, addToGarage, removeFromGarage, selectedCars, toggleCarSelection } =
    useCarStore();

  const isFavorited = garage.some((item) => item._id === car._id);
  const isCompared = selectedCars.includes(car._id);

  // EMI Calculator State
  const carPrice = car.price || 1500000;
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);

  const downPaymentAmount = Math.round((carPrice * downPaymentPercent) / 100);
  const loanAmount = carPrice - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = loanTenureYears * 12;

  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = monthlyEmi * totalMonths + downPaymentAmount;
  const totalInterest = totalPayment - carPrice;

  const formatRupees = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  const handleGarageToggle = () => {
    if (isFavorited) {
      removeFromGarage(car._id);
      toast.success(`${car.name} removed from your garage`);
    } else {
      addToGarage(car);
      toast.success(`${car.name} added to your garage!`);
    }
  };

  const handleCompareToggle = () => {
    if (!isCompared && selectedCars.length >= 2) {
      toast.error('You can only compare 2 cars at a time.');
      return;
    }
    toggleCarSelection(car._id);
    if (!isCompared) {
      toast.success(`Added ${car.name} to comparison dock`);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl my-8 cursor-default"
      >
        {/* Header bar with close */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-105 cursor-pointer shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Image Section */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900">
          <img
            src={getCarImageUrl(car)}
            alt={car.name}
            onError={(e) => handleImageError(e, car.bodyType)}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {car.brand}
            </span>
            <span className="rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {car.bodyType}
            </span>
            <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold capitalize text-white backdrop-blur-md">
              {car.fuelType}
            </span>
          </div>

          {/* Title & Price on hero */}
          <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold text-white">{car.rating || 4.6}</span>
                </div>
                <span className="text-xs text-gray-300">
                  ({car.reviewCount?.toLocaleString() || '1,500+'} reviews)
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{car.name}</h2>
              <p className="text-sm text-gray-300 mt-1 max-w-xl line-clamp-2">
                {car.description}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ex-Showroom</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">{car.priceDisplay}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for test drive & direct booking</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCompareToggle}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isCompared
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span>{isCompared ? 'In Compare List ✓' : 'Add to Compare'}</span>
              </button>

              <button
                onClick={handleGarageToggle}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isFavorited
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-600' : ''}`} />
                <span>{isFavorited ? 'Saved in Garage' : 'Save to Garage'}</span>
              </button>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Max Power</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{car.power} PS</p>
                <p className="text-[11px] text-gray-400">Torque: {car.torque} Nm</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Fuel Efficiency</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{car.mileage} {car.mileageUnit}</p>
                <p className="text-[11px] text-gray-400 capitalize">{car.fuelType}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Acceleration (0-100)</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{car.acceleration}s</p>
                <p className="text-[11px] text-gray-400">Top Speed: {car.topSpeed} km/h</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500">Transmission & Drive</p>
                <p className="mt-1 text-xl font-bold text-gray-900 capitalize">{car.transmission}</p>
                <p className="text-[11px] text-gray-400 uppercase">{car.drivetrain || car.driveType}</p>
              </div>
            </div>
          </div>

          {/* Features Highlights */}
          {car.features && car.features.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Featured Equipment & Safety
              </h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Engine Rev & Soundbox */}
          <EngineRevSoundbox car={car} />

          {/* Interactive Loan & EMI Calculator */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-blue-600" />
                  Smart EMI & Financing Calculator
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Customize down payment and loan tenure to estimate monthly payments
                </p>
              </div>
              <div className="rounded-2xl bg-white border border-blue-200 px-5 py-3 shadow-md sm:text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase">Estimated Monthly EMI</p>
                <p className="text-2xl font-extrabold text-blue-600">{formatRupees(monthlyEmi)}</p>
                <p className="text-[11px] text-gray-500">for {loanTenureYears} years ({totalMonths} mos)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Down Payment Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>Down Payment ({downPaymentPercent}%)</span>
                  <span className="text-blue-600">{formatRupees(downPaymentAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>10% min</span>
                  <span>60% max</span>
                </div>
              </div>

              {/* Loan Tenure Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>Loan Duration</span>
                  <span className="text-blue-600">{loanTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>1 Year</span>
                  <span>7 Years</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-2">
                  <span>Interest Rate</span>
                  <span className="text-blue-600">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="7.5"
                  max="14.0"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>7.5%</span>
                  <span>14.0%</span>
                </div>
              </div>
            </div>

            {/* Loan Summary breakdown */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-blue-100 pt-4 text-xs">
              <div>
                <span className="text-gray-500">Principal Loan Amount:</span>
                <p className="font-bold text-gray-900">{formatRupees(loanAmount)}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Interest Payable:</span>
                <p className="font-bold text-gray-900">{formatRupees(totalInterest)}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-gray-500">Total Loan Cost:</span>
                <p className="font-bold text-gray-900">{formatRupees(totalPayment)}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            *Pricing and interest rates subject to location and financial terms.
          </p>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onOpenTco && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTco(car);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-purple-500/20"
              >
                <Calculator className="h-4 w-4" />
                <span>5-Yr True Cost (TCO)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;

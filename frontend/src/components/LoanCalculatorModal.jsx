import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  Percent,
  Calendar,
  IndianRupee,
  Sparkles,
  PieChart,
  ArrowRight,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { getCarImageUrl } from '../utils/carImages';
import toast from 'react-hot-toast';

export const LoanCalculatorModal = ({ cars = [], onClose, onViewTco }) => {
  // If cars exist, default to the first one, or allow custom
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?._id || 'custom');
  const selectedCar = cars.find((c) => c._id === selectedCarId);

  // Financial inputs
  const defaultPrice = selectedCar ? selectedCar.price : 1800000;
  const [customPrice, setCustomPrice] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);

  const activePrice = selectedCar ? selectedCar.price : customPrice;

  // Handle car dropdown change
  const handleCarSelect = (id) => {
    setSelectedCarId(id);
    if (id !== 'custom') {
      const found = cars.find((c) => c._id === id);
      if (found) {
        setCustomPrice(found.price);
      }
    }
  };

  // Calculations
  const loanStats = useMemo(() => {
    const downPaymentAmount = Math.round((activePrice * downPaymentPercent) / 100);
    const loanAmount = Math.max(0, activePrice - downPaymentAmount);
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenureYears * 12;

    let monthlyEmi = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyEmi = Math.round(
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
    }

    const totalPayment = monthlyEmi * totalMonths;
    const totalInterest = Math.max(0, totalPayment - loanAmount);
    const totalExpenditure = totalPayment + downPaymentAmount;

    // Percentages for visual bar
    const principalPct = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 50;
    const interestPct = totalPayment > 0 ? 100 - principalPct : 50;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyEmi,
      totalPayment,
      totalInterest,
      totalExpenditure,
      principalPct,
      interestPct,
      totalMonths,
    };
  }, [activePrice, downPaymentPercent, loanTenureYears, interestRate]);

  const formatRupees = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl text-white overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Interactive Auto Loan & EMI Calculator</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Live Amortization
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Simulate monthly payments, down payment thresholds, and lifetime interest rates.
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Vehicle Selector Dropdown */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
              Select Vehicle to Finance:
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={selectedCarId}
                onChange={(e) => handleCarSelect(e.target.value)}
                className="w-full sm:flex-1 rounded-xl border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="custom">✏️ Custom Loan Amount</option>
                {cars.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.priceDisplay} ({c.bodyType?.toUpperCase()}, {c.fuelType})
                  </option>
                ))}
              </select>

              {selectedCarId === 'custom' ? (
                <div className="w-full sm:w-48 flex items-center rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white">
                  <span className="text-gray-400 mr-1.5 font-bold">₹</span>
                  <input
                    type="number"
                    min="100000"
                    max="50000000"
                    step="50000"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full bg-transparent outline-none font-bold text-blue-400"
                  />
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-950/40 border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-400 shrink-0">
                  <span>Price: {formatRupees(activePrice)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Big EMI Highlight Display */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-gray-900 to-indigo-950/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 block mb-1">
                Estimated Monthly EMI
              </span>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatRupees(loanStats.monthlyEmi)}
                <span className="text-sm sm:text-base font-semibold text-gray-400 ml-1.5">/ month</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                For {loanTenureYears} Years ({loanStats.totalMonths} monthly installments) at {interestRate}% APR
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs">
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 font-bold text-emerald-400">
                Loan: {formatRupees(loanStats.loanAmount)}
              </span>
              <span className="text-gray-400 mt-1">
                Down Payment: {formatRupees(loanStats.downPaymentAmount)} ({downPaymentPercent}%)
              </span>
            </div>
          </div>

          {/* Interactive Input Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl bg-gray-950/60 border border-gray-800 p-5">
            
            {/* 1. Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-300">Down Payment</span>
                <span className="text-blue-400 font-extrabold">{downPaymentPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">
                Upfront: {formatRupees(loanStats.downPaymentAmount)}
              </span>
            </div>

            {/* 2. Loan Tenure Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-300">Loan Tenure</span>
                <span className="text-blue-400 font-extrabold">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">
                {loanStats.totalMonths} Monthly Installments
              </span>
            </div>

            {/* 3. Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-gray-300">Annual Interest Rate</span>
                <span className="text-blue-400 font-extrabold">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="15.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-gray-400 mt-1.5 block font-medium">
                Current auto loan rates: 8.5% - 10.5%
              </span>
            </div>
          </div>

          {/* Principal vs Interest Amortization Bar */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-gray-300">Loan Repayment Breakdown</span>
              <span className="text-gray-400">Total Payable: {formatRupees(loanStats.totalPayment)}</span>
            </div>

            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${loanStats.principalPct}%` }}
                title={`Principal: ${loanStats.principalPct}%`}
              />
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${loanStats.interestPct}%` }}
                title={`Interest: ${loanStats.interestPct}%`}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-300">
                  Principal Amount: <strong className="text-white">{formatRupees(loanStats.loanAmount)}</strong> ({loanStats.principalPct}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span className="text-gray-300">
                  Total Interest: <strong className="text-white">{formatRupees(loanStats.totalInterest)}</strong> ({loanStats.interestPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-800 bg-gray-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            *Standard reducing balance amortization formula applied: <code className="text-gray-300">E = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)</code>
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {selectedCar && onViewTco && (
              <button
                onClick={() => {
                  onClose();
                  onViewTco(selectedCar);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/40 px-4 py-2.5 text-xs font-bold text-purple-300 transition-all"
              >
                <span>5-Yr True Cost (TCO)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `Auto Loan Breakdown for ${selectedCar ? selectedCar.name : 'Custom Vehicle'}: Monthly EMI: ${formatRupees(loanStats.monthlyEmi)}, Loan: ${formatRupees(loanStats.loanAmount)}, Total Interest: ${formatRupees(loanStats.totalInterest)}.`
                );
                toast.success('Loan breakdown copied to clipboard!');
              }}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/25"
            >
              Copy EMI Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculatorModal;

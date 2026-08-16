import React, { useEffect, useState } from 'react';
import { useCarStore } from '../services/store';
import { X, Loader, Trophy } from 'lucide-react';

export const CarComparison = ({ car1Id, car2Id, onClose }) => {
  const { comparisonData, comparisonLoading, compareCars } = useCarStore();

  useEffect(() => {
    if (car1Id && car2Id) {
      compareCars(car1Id, car2Id);
    }
  }, [car1Id, car2Id]);

  if (comparisonLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-700">Analyzing cars...</p>
        </div>
      </div>
    );
  }

  if (!comparisonData) return null;

  const { car1, car2, comparison } = comparisonData;

  const ComparisonRow = ({ label, value1, value2, highlight = false }) => (
    <div className={`grid grid-cols-3 gap-4 py-4 border-b border-gray-200 ${highlight ? 'bg-blue-50' : ''}`}>
      <div className="font-semibold text-gray-900">{label}</div>
      <div className={`text-gray-700 ${highlight ? 'bg-blue-100 p-2 rounded' : ''}`}>
        {value1}
      </div>
      <div className={`text-gray-700 ${highlight ? 'bg-blue-100 p-2 rounded' : ''}`}>
        {value2}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {car1.name} vs {car2.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Car Headers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div />
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{car1.name}</h3>
              <p className="text-sm text-gray-600">{car1.priceDisplay}</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">{car2.name}</h3>
              <p className="text-sm text-gray-600">{car2.priceDisplay}</p>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing</h4>
            <ComparisonRow
              label="Price"
              value1={car1.priceDisplay}
              value2={car2.priceDisplay}
              highlight
            />
          </div>

          {/* Performance */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Performance</h4>
            <p className="text-gray-700 mb-4">{comparison.performance}</p>
            <ComparisonRow
              label="Power"
              value1={`${car1.power} PS`}
              value2={`${car2.power} PS`}
            />
            <ComparisonRow
              label="Torque"
              value1={`${car1.torque} Nm`}
              value2={`${car2.torque} Nm`}
            />
            <ComparisonRow
              label="0-100 km/h"
              value1={`${car1.acceleration}s`}
              value2={`${car2.acceleration}s`}
            />
            <ComparisonRow
              label="Top Speed"
              value1={`${car1.topSpeed} km/h`}
              value2={`${car2.topSpeed} km/h`}
            />
          </div>

          {/* Comfort & Features */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Comfort & Features
            </h4>
            <p className="text-gray-700 mb-4">{comparison.comfort}</p>
            <ComparisonRow
              label="Seating"
              value1={`${car1.seatingCapacity} seats`}
              value2={`${car2.seatingCapacity} seats`}
            />
          </div>

          {/* Mileage */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Fuel Efficiency</h4>
            <p className="text-gray-700 mb-4">{comparison.mileage}</p>
            <ComparisonRow
              label="Mileage"
              value1={`${car1.mileage} ${car1.mileageUnit}`}
              value2={`${car2.mileage} ${car2.mileageUnit}`}
            />
          </div>

          {/* Driving Characteristics */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                City Driving
              </h4>
              <p className="text-gray-700">{comparison.cityDriving}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Highway Driving
              </h4>
              <p className="text-gray-700">{comparison.highwayDriving}</p>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-3">{car1.name}</h4>
              <div className="space-y-2">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">Pros</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    {comparison.prosOfCar1?.map((pro, idx) => (
                      <li key={idx}>✓ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-900 mb-2">Cons</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    {comparison.consOfCar1?.map((con, idx) => (
                      <li key={idx}>✗ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-3">{car2.name}</h4>
              <div className="space-y-2">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">Pros</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    {comparison.prosOfCar2?.map((pro, idx) => (
                      <li key={idx}>✓ {pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-900 mb-2">Cons</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    {comparison.consOfCar2?.map((con, idx) => (
                      <li key={idx}>✗ {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Final Recommendation */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-500">
            <h4 className="text-lg font-bold text-blue-900 mb-3">Our Recommendation</h4>
            <p className="text-blue-900 mb-4">{comparison.finalRecommendation}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-900 mb-1">Best For {car1.name}:</p>
                <p className="text-blue-800">{comparison.bestFor?.car1}</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Best For {car2.name}:</p>
                <p className="text-blue-800">{comparison.bestFor?.car2}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarComparison;

import React, { useState } from 'react';
import { Zap, Gauge, Droplet, Users, Smartphone } from 'lucide-react';

const buildCarImageUrl = (car) =>
  `https://dummyimage.com/1200x800/111827/ffffff&text=${encodeURIComponent(
    car.name
  )}`;

export const CarCard = ({ car, onCompareClick, isSelected, onSelectChange, inGarage, budget, onAddToGarage }) => {
  const [showDetails, setShowDetails] = useState(false);
  const imageUrl = buildCarImageUrl(car);

  const specs = [
    { icon: Zap, label: 'Power', value: `${car.power} PS` },
    { icon: Gauge, label: 'Mileage', value: `${car.mileage} ${car.mileageUnit}` },
    { icon: Droplet, label: 'Fuel', value: car.fuelType },
    { icon: Users, label: 'Seats', value: car.seatingCapacity },
  ];

  const underBudget = budget && car.price <= Number(budget);

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-sm">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white">
            {car.year}
          </span>
        </div>

        {/* Checkbox for comparison */}
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectChange(e.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{car.brand}</p>

        {/* Price */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-2xl font-semibold text-gray-900">{car.priceDisplay}</p>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-600" />
                <div className="text-xs">
                  <p className="text-gray-600">{spec.label}</p>
                  <p className="font-semibold text-gray-900">{spec.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Body Type */}
        <div className="mb-4">
          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full capitalize">
            {car.bodyType}
          </span>
        </div>

        {/* Features Preview */}
        <div className="flex flex-wrap gap-1 mb-4">
          {car.features.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
              {feature}
            </span>
          ))}
          {car.features.length > 2 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              +{car.features.length - 2}
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
          >
            View Details
          </button>
          <button
            onClick={() => onCompareClick(car._id)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Compare
          </button>
          <button
            onClick={onAddToGarage}
            disabled={inGarage}
            className={`w-full rounded-lg px-4 py-2 font-medium transition-colors ${
              inGarage
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {inGarage ? 'In Garage' : 'Add to Garage'}
          </button>
          {budget && (
            <p className={`text-sm ${underBudget ? 'text-green-700' : 'text-red-700'}`}>
              {underBudget ? 'Within budget' : 'Above budget'}
            </p>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-5 pb-5 border-t border-gray-200 space-y-3">
          <div className="text-sm">
            <p className="text-gray-600 mb-2">{car.description}</p>
            <p className="text-gray-700">
              <span className="font-semibold">Transmission:</span> {car.transmission}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Drive Type:</span> {car.driveType.toUpperCase()}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Safety Rating:</span> ⭐ {car.safetyRating}/5
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Engine:</span> {car.engineSize} ({car.power} PS, {car.torque} Nm)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCard;

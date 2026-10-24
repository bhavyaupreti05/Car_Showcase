import React from 'react';
import { Zap, Gauge, Droplet, Users, Heart, Scale, Star, ArrowUpRight, Calculator } from 'lucide-react';
import { getCarImageUrl, handleImageError } from '../utils/carImages';

export const CarCard = ({
  car,
  onCompareClick,
  isSelected,
  onSelectChange,
  inGarage,
  budget,
  onAddToGarage,
  onViewDetails,
  onViewTco,
}) => {
  const imageUrl = getCarImageUrl(car);

  const specs = [
    { icon: Zap, label: 'Power', value: `${car.power} PS` },
    { icon: Gauge, label: 'Mileage', value: `${car.mileage} ${car.mileageUnit}` },
    { icon: Droplet, label: 'Fuel', value: car.fuelType },
    { icon: Users, label: 'Seats', value: `${car.seatingCapacity} Seater` },
  ];

  const underBudget = budget && car.price <= Number(budget);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
          : 'border-gray-200/80 shadow-sm'
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-950">
          <img
            src={imageUrl}
            alt={car.name}
            onError={(e) => handleImageError(e, car.bodyType)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-80" />

          {/* Top-left: Compare Checkbox Pill */}
          <div className="absolute top-3 left-3">
            <label
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectChange(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>{isSelected ? 'Comparing' : 'Compare'}</span>
            </label>
          </div>

          {/* Top-right: Garage Heart Button */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              {car.year}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToGarage();
              }}
              title={inGarage ? 'Saved in Garage' : 'Save to Garage'}
              className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                inGarage
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-black/50 text-white hover:bg-black/80 hover:scale-110'
              }`}
            >
              <Heart className={`h-4 w-4 ${inGarage ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Bottom over image: Body Type & Rating */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white">
            <span className="rounded-md bg-white/20 px-2.5 py-0.5 font-medium uppercase tracking-wider backdrop-blur-md">
              {car.bodyType}
            </span>
            <div className="flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 backdrop-blur-md">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{car.rating || 4.5}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Brand & Name */}
          <div className="mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{car.brand}</p>
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-1">
              {car.name}
            </h3>
          </div>

          {/* Price */}
          <div className="mb-4 flex items-baseline justify-between border-b border-gray-100 pb-3">
            <div>
              <p className="text-2xl font-black text-gray-900 tracking-tight">{car.priceDisplay}</p>
              <p className="text-[11px] text-gray-400">Ex-showroom price</p>
            </div>
            {budget && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  underBudget
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {underBudget ? 'Within Budget' : 'Above Budget'}
              </span>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {specs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl bg-gray-50/80 p-2.5 border border-gray-100"
                >
                  <Icon className="h-4 w-4 shrink-0 text-blue-600" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                      {spec.label}
                    </p>
                    <p className="text-xs font-bold text-gray-800 truncate capitalize">
                      {spec.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Highlights */}
          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {car.features.slice(0, 2).map((feature, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                >
                  {feature}
                </span>
              ))}
              {car.features.length > 2 && (
                <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                  +{car.features.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails?.(car)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-3 py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 active:scale-95 shadow-sm"
          >
            <span>Specs & EMI</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onCompareClick(car._id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              isSelected
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>{isSelected ? 'Selected' : 'Compare'}</span>
          </button>
        </div>

        {onViewTco && (
          <button
            onClick={() => onViewTco(car)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 text-xs font-bold transition-colors"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>5-Year True Cost (TCO)</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCard;

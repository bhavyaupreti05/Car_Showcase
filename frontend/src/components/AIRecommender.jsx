import React, { useEffect, useState } from 'react';
import { useCarStore } from '../services/store';
import { Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const buildCarImageUrl = (car) =>
  `https://dummyimage.com/1200x800/111827/ffffff&text=${encodeURIComponent(
    car.name
  )}`;

export const AIRecommender = () => {
  const [query, setQuery] = useState('');
  const { recommendations, recommendationLoading, getRecommendations } =
    useCarStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    getRecommendations(query);
  };

  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Simple Recommendations
          </h2>
          <p className="mt-2 text-gray-600">
            Describe what you want and we will suggest a few suitable options.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: family SUV, city car, or electric sedan"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
              <Search className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={recommendationLoading}
              className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {recommendationLoading && <Loader className="mr-2 inline h-4 w-4 animate-spin" />}
              {recommendationLoading ? 'Searching...' : 'Find Cars'}
            </button>
          </div>
        </form>

        {/* Recommendations Grid */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((car) => (
                <div
                  key={car._id || car.name}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="bg-gray-100 h-48 flex items-center justify-center">
                    <img
                      src={buildCarImageUrl(car)}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {car.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{car.brand}</p>

                    {/* Price */}
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">
                        {car.priceDisplay}
                      </p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Fuel Type</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {car.fuelType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Transmission</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {car.transmission}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mileage</p>
                        <p className="font-semibold text-gray-900">
                          {car.mileage} {car.mileageUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {car.bodyType}
                        </p>
                      </div>
                    </div>

                    {/* AI Reason */}
                    {car.aiReason && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Why this car? </span>
                          {car.aiReason}
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!recommendationLoading && recommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Enter a query to get personalized car recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommender;

import React from 'react';
import { ChevronDown } from 'lucide-react';

export const CarFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    bodyType: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>
      <div className="space-y-4">
        {/* Body Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Type
          </label>
          <select
            name="bodyType"
            value={filters.bodyType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="coupe">Coupe</option>
            <option value="wagon">Wagon</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Fuels</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
            <option value="cng">CNG</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transmission
          </label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Transmissions</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setFilters({
              bodyType: '',
              fuelType: '',
              transmission: '',
              minPrice: '',
              maxPrice: '',
            });
            onFilterChange({});
          }}
          className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CarFilter;

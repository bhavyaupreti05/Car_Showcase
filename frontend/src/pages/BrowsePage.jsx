import React, { useEffect, useState, useMemo } from 'react';
import { Loader, Search, SlidersHorizontal, ArrowUpDown, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCarStore } from '../services/store';
import CarCard from '../components/CarCard';
import CarFilter from '../components/CarFilter';
import QuickFilterPills from '../components/QuickFilterPills';

export const BrowsePage = ({ onViewDetails, onViewTco }) => {
  const {
    cars,
    loading,
    selectedCars,
    toggleCarSelection,
    fetchCars,
    openCompareModal,
    budget,
    setBudget,
    garage,
    addToGarage,
    removeFromGarage,
  } = useCarStore();

  const [filters, setFilters] = useState({});
  const [activePreset, setActivePreset] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchCars(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setActivePreset('custom');
    setFilters(newFilters);
  };

  const handleSelectPreset = (presetId, presetFilter) => {
    setActivePreset(presetId);
    setFilters(presetFilter);
  };

  const handleSelectCar = (carId, isSelected) => {
    if (isSelected || selectedCars.length < 2) {
      toggleCarSelection(carId);
    }
  };

  const handleCompareClick = (carId) => {
    const isSelected = selectedCars.includes(carId);

    if (isSelected && selectedCars.length === 2) {
      openCompareModal();
      return;
    }

    if (!isSelected && selectedCars.length >= 2) {
      toast.error('You can select up to 2 cars to compare.');
      return;
    }

    toggleCarSelection(carId);
  };

  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };

  const handleAddToGarage = (car) => {
    addToGarage(car);
    toast.success(`${car.name} added to your garage`);
  };

  const handleRemoveFromGarage = (carId) => {
    removeFromGarage(carId);
    toast.success('Removed from garage');
  };

  // Client-side search and sort
  const displayedCars = useMemo(() => {
    let result = [...cars];

    // Search query filter (name, brand, or model)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'power_desc') {
      result.sort((a, b) => b.power - a.power);
    } else if (sortBy === 'mileage_desc') {
      result.sort((a, b) => b.mileage - a.mileage);
    } else if (sortBy === 'rating_desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [cars, searchQuery, sortBy]);

  // Calculate total garage price
  const totalGarageValue = garage.reduce((sum, car) => sum + (car.price || 0), 0);
  const budgetNum = Number(budget) || 0;
  const budgetUsagePercent = budgetNum > 0 ? Math.min(100, Math.round((totalGarageValue / budgetNum) * 100)) : 0;

  return (
    <div className="space-y-8">
      {/* Catalogue Header & Live Search Bar */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Premium Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore Vehicle Collection
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Discover, filter, and compare across {cars.length} verified cars with AI analysis.
            </p>
          </div>

          {/* Quick Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, name..."
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 outline-none focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value="default">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="power_desc">Power: Highest First</option>
                <option value="mileage_desc">Mileage: Best First</option>
                <option value="rating_desc">Rating: Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Presets */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <QuickFilterPills
            activePreset={activePreset}
            onSelectPreset={handleSelectPreset}
          />
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Detailed Filters & My Garage */}
        <div className="lg:col-span-1 space-y-6">
          <CarFilter onFilterChange={handleFilterChange} />

          {/* Enhanced My Garage Widget */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">My Garage</h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {garage.length} Saved
              </span>
            </div>

            {/* Budget Monitor */}
            <div className="mb-4 rounded-xl bg-gray-50 p-3.5 border border-gray-100">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1.5">
                <span>Budget Cap:</span>
                <input
                  type="number"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder="e.g. 3000000"
                  className="w-28 rounded-md border border-gray-200 bg-white px-2 py-1 text-right text-xs outline-none focus:border-blue-500"
                />
              </div>

              {budgetNum > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>Used: ₹{(totalGarageValue / 100000).toFixed(2)}L</span>
                    <span>Cap: ₹{(budgetNum / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        budgetUsagePercent > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Garage Items */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {garage.length > 0 ? (
                garage.map((car) => {
                  const underBudget = budget && car.price <= Number(budget);
                  return (
                    <div
                      key={car._id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/70 p-3 transition-colors hover:bg-gray-100/70"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{car.name}</p>
                        <p className="text-[11px] font-semibold text-blue-600">{car.priceDisplay}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromGarage(car._id)}
                        className="text-[11px] font-medium text-rose-600 hover:text-rose-800 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  Click the heart icon on any car to pin it here and track your budget.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Cars Grid or Skeletons */}
        <div className="lg:col-span-3">
          {loading ? (
            /* Shimmer Skeleton Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse space-y-4"
                >
                  <div className="h-48 w-full rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-6 w-1/2 rounded bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 rounded-lg bg-gray-100" />
                    <div className="h-10 rounded-lg bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedCars.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Showing {displayedCars.length} of {cars.length} cars</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:underline"
                  >
                    Clear search filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                    isSelected={selectedCars.includes(car._id)}
                    inGarage={garage.some((item) => item._id === car._id)}
                    budget={budget}
                    onSelectChange={(isSelected) =>
                      handleSelectCar(car._id, isSelected)
                    }
                    onCompareClick={handleCompareClick}
                    onAddToGarage={() => handleAddToGarage(car)}
                    onViewDetails={onViewDetails}
                    onViewTco={onViewTco}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No cars found</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                No vehicles matched your current filter criteria or search query. Try clearing filters or searching for another term.
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                  setActivePreset('all');
                }}
                className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrowsePage;

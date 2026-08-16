import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCarStore } from '../services/store';
import CarCard from '../components/CarCard';
import CarFilter from '../components/CarFilter';
import CarComparison from '../components/CarComparison';

export const BrowsePage = () => {
  const {
    cars,
    loading,
    selectedCars,
    toggleCarSelection,
    fetchCars,
    compareOpen,
    openCompareModal,
    closeCompareModal,
    budget,
    setBudget,
    garage,
    addToGarage,
    removeFromGarage,
  } = useCarStore();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCars(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
      toast.error('Select up to 2 cars to compare.');
      return;
    }

    toggleCarSelection(carId);

    if (!isSelected && selectedCars.length === 1) {
      openCompareModal();
    }
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

  const getCar = (id) => cars.find((c) => c._id === id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Cars</h1>
          <p className="text-gray-600">
            Discover from {cars.length} vehicles in our collection
          </p>
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            {selectedCars.length === 0 && 'Select up to 2 cars using the checkbox to compare them.'}
            {selectedCars.length === 1 && 'One car selected. Pick one more car and click Compare Selected.'}
            {selectedCars.length === 2 && 'Two cars selected. Click Compare Selected or use the Compare button on a card.'}
            {compareOpen && selectedCars.length === 2 && ' Comparison modal is open. Close it to adjust selections.'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter and Garage */}
          <div className="lg:col-span-1 space-y-6">
            <CarFilter onFilterChange={handleFilterChange} />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">My Garage</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget
              </label>
              <input
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                placeholder="Enter budget amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />

              <div className="space-y-3">
                {garage.length > 0 ? (
                  garage.map((car) => {
                    const underBudget = budget && car.price <= Number(budget);
                    return (
                      <div
                        key={car._id}
                        className="rounded-xl border border-gray-200 p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">{car.name}</p>
                            <p className="text-sm text-gray-600">{car.priceDisplay}</p>
                            {budget && (
                              <span
                                className={`inline-flex mt-2 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  underBudget
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {underBudget ? 'Within budget' : 'Above budget'}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromGarage(car._id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-600">
                    Add cars to your garage and keep track of your budget.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading cars...</p>
                </div>
              </div>
            ) : cars.length > 0 ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Cars ({cars.length})
                  </h2>
                  {selectedCars.length === 2 && (
                    <button
                      onClick={openCompareModal}
                      className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      Compare Selected
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
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
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No cars found with the selected filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {compareOpen && selectedCars.length === 2 && (
        <CarComparison
          car1Id={selectedCars[0]}
          car2Id={selectedCars[1]}
          onClose={() => closeCompareModal()}
        />
      )}
    </div>
  );
};

export default BrowsePage;

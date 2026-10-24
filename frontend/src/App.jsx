import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrowsePage from './pages/BrowsePage';
import AIRecommender from './components/AIRecommender';
import Footer from './components/Footer';
import ComparisonDock from './components/ComparisonDock';
import CarDetailsModal from './components/CarDetailsModal';
import DragRaceSimulator from './components/DragRaceSimulator';
import CarComparison from './components/CarComparison';
import TCOCalculatorModal from './components/TCOCalculatorModal';
import LoanCalculatorModal from './components/LoanCalculatorModal';
import { useCarStore } from './services/store';

function App() {
  const {
    cars,
    selectedCars,
    compareOpen,
    openCompareModal,
    closeCompareModal,
    dragRaceOpen,
    closeDragRace,
  } = useCarStore();
  const [detailsCar, setDetailsCar] = useState(null);
  const [tcoCar, setTcoCar] = useState(null);
  const [loanModalOpen, setLoanModalOpen] = useState(false);

  const car1 = cars.find((c) => c._id === selectedCars[0]);
  const car2 = cars.find((c) => c._id === selectedCars[1]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" />
      
      <Navbar
        selectedCount={selectedCars.length}
        onCompareClick={() => {
          if (selectedCars.length === 2) {
            openCompareModal();
          } else {
            toast.error('Select 2 cars to compare.');
          }
        }}
        onLoanCalculatorClick={() => setLoanModalOpen(true)}
      />

      <Hero />

      <main id="browse" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <BrowsePage
          onViewDetails={(car) => setDetailsCar(car)}
          onViewTco={(car) => setTcoCar(car)}
        />
      </main>

      <section id="ai-recommend" className="border-t border-gray-200">
        <AIRecommender
          onViewDetails={(car) => setDetailsCar(car)}
          onViewTco={(car) => setTcoCar(car)}
        />
      </section>

      <Footer />

      {/* Floating Comparison Dock */}
      <ComparisonDock />

      {/* Standalone Interactive EMI & Auto Loan Calculator Modal */}
      {loanModalOpen && (
        <LoanCalculatorModal
          cars={cars}
          onClose={() => setLoanModalOpen(false)}
          onViewTco={(car) => {
            setLoanModalOpen(false);
            setTcoCar(car);
          }}
        />
      )}

      {/* 5-Year True Cost of Ownership & Depreciation Modal */}
      {tcoCar && (
        <TCOCalculatorModal
          car={tcoCar}
          onClose={() => setTcoCar(null)}
        />
      )}

      {/* Car Details & EMI Calculator Modal */}
      {detailsCar && (
        <CarDetailsModal
          car={detailsCar}
          onOpenTco={(car) => setTcoCar(car)}
          onClose={() => setDetailsCar(null)}
        />
      )}

      {/* Quarter-Mile Drag Race Simulator Modal */}
      {dragRaceOpen && car1 && car2 && (
        <DragRaceSimulator
          car1={car1}
          car2={car2}
          onClose={closeDragRace}
        />
      )}

      {/* Head-to-Head Comparison Modal */}
      {compareOpen && selectedCars.length === 2 && (
        <CarComparison
          car1Id={selectedCars[0]}
          car2Id={selectedCars[1]}
          onClose={closeCompareModal}
        />
      )}
    </div>
  );
}

export default App;

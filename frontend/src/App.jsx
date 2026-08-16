import React from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrowsePage from './pages/BrowsePage';
import AIRecommender from './components/AIRecommender';
import Footer from './components/Footer';
import { useCarStore } from './services/store';

function App() {
  const { selectedCars, openCompareModal } = useCarStore();

  return (
    <div className="min-h-screen bg-gray-50">
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
      />

      <Hero />

      <main id="browse" className="max-w-7xl mx-auto">
        <BrowsePage />
      </main>

      <section id="ai-recommend" className="bg-white py-12">
        <AIRecommender />
      </section>

      <Footer />
    </div>
  );
}

export default App;

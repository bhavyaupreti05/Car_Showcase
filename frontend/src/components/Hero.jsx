import React from 'react';
import { Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
            Car Showcase
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
            Find a car that fits your everyday needs.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse trusted listings, compare options, and discover a simple way to choose your next vehicle.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#browse" className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
              Browse Cars
            </a>
            <a href="#ai-recommend" className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Get Recommendations
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Search, label: 'Easy search', desc: 'Filter by brand, fuel, and year' },
              { icon: SlidersHorizontal, label: 'Simple compare', desc: 'Pick two cars and review side by side' },
              { icon: ShieldCheck, label: 'Reliable info', desc: 'Clear specs and practical details' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <Icon className="h-5 w-5 text-gray-700" />
                  <p className="mt-3 font-medium text-gray-900">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

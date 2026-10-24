import React from 'react';
import { Search, SlidersHorizontal, ShieldCheck, Sparkles, ArrowRight, Zap, Scale } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-16 md:py-24 border-b border-gray-800">
      {/* Background ambient glow effect */}
      <div className="absolute top-0 right-1/4 -z-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 backdrop-blur-md mb-6 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-spin" />
            <span>Next-Gen AI Car Discovery Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]">
            Discover, Compare & Finance Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Dream Car.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-xl text-gray-300 leading-relaxed font-normal">
            Explore verified vehicles, calculate live loan EMIs, and query our OpenAI consultant for tailor-made automotive recommendations.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5">
            <a
              href="#browse"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#ai-recommend"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-500/40 bg-purple-950/40 px-7 py-3.5 text-sm font-bold text-purple-200 backdrop-blur-md transition-all hover:bg-purple-900/60 hover:text-white hover:border-purple-500 active:scale-95 shadow-lg shadow-purple-500/10"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>AI Personas & DNA Matcher</span>
            </a>
          </div>

          {/* Value Props Cards */}
          <div className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                label: 'Verified Specs',
                desc: 'Horsepower, torque, 0-100 & mileage figures',
              },
              {
                icon: Scale,
                label: 'Head-to-Head Compare',
                desc: 'Side-by-side benchmark with winner analysis',
              },
              {
                icon: ShieldCheck,
                label: 'Live EMI Calculator',
                desc: 'Real-time loan terms, interest & down payment',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-800/80 bg-gray-900/60 p-4 backdrop-blur-md transition-all hover:border-gray-700 hover:bg-gray-900/90"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-bold text-sm text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-400 leading-normal">{item.desc}</p>
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

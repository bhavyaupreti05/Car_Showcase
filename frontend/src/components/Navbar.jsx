import React, { useState } from 'react';
import { Menu, X, Scale, Sparkles, Heart, Calculator } from 'lucide-react';
import { useCarStore } from '../services/store';

export const Navbar = ({ selectedCount, onCompareClick, onLoanCalculatorClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { garage } = useCarStore();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur-md transition-shadow shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-gray-900 via-blue-900 to-blue-600 text-white font-black text-sm shadow-md transition-transform group-hover:scale-105">
            🚗
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-gray-900 flex items-center gap-1 leading-none">
              Car <span className="text-blue-600">Showcase</span>
              <span className="rounded-md bg-blue-50 text-blue-600 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                AI
              </span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide">
              Automotive Marketplace
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#browse"
            className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-blue-600 transition-colors"
          >
            Inventory
          </a>
          <a
            href="#ai-recommend"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-spin" />
            AI Persona & DNA
          </a>
          <button
            type="button"
            onClick={onLoanCalculatorClick}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Calculator className="h-3.5 w-3.5 text-blue-600" />
            <span>Loan Calculator</span>
          </button>
        </div>

        {/* Right side widgets */}
        <div className="flex items-center gap-3">
          {/* Garage Counter */}
          {garage.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-200">
              <Heart className="h-3.5 w-3.5 fill-red-600 text-red-600" />
              <span>{garage.length} in Garage</span>
            </div>
          )}

          {/* Compare Badge & Action */}
          {selectedCount > 0 && (
            <button
              onClick={onCompareClick}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare ({selectedCount}/2)</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3">
            <a
              href="#browse"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Inventory
            </a>
            <a
              href="#ai-recommend"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>AI Persona & DNA</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLoanCalculatorClick?.();
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 text-left w-full cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-blue-600" />
              <span>Loan & EMI Calculator</span>
            </button>
            {selectedCount > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCompareClick();
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Scale className="h-4 w-4" />
                Compare ({selectedCount}/2)
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Sparkles, Zap, DollarSign, Star, Shield, Sliders } from 'lucide-react';

const PRESETS = [
  { id: 'all', label: 'All Cars', filter: {} },
  { id: 'ev_hybrid', label: '⚡ Electric & Hybrid', filter: { fuelType: 'electric' } },
  { id: 'suv', label: '🚙 Premium SUVs', filter: { bodyType: 'suv' } },
  { id: 'sedan', label: '🏎️ Sedans', filter: { bodyType: 'sedan' } },
  { id: 'under15', label: '💰 Under ₹15 Lakh', filter: { maxPrice: 1500000 } },
  { id: 'auto', label: '⚙️ Automatic Only', filter: { transmission: 'automatic' } },
];

export const QuickFilterPills = ({ activePreset, onSelectPreset }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1 flex items-center gap-1">
        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
        Quick Filters:
      </span>
      {PRESETS.map((preset) => {
        const isActive = activePreset === preset.id;
        return (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset.id, preset.filter)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilterPills;

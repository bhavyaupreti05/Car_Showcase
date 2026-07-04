"use client";
import { useState } from 'react';
import { CustomFilterProps } from '../types';

const CustomFilter = ({ title, options, setFilter }: CustomFilterProps) => {
  const [selected, setSelected] = useState(options[0]?.value || '');

  return (
    <div className="w-fit">
      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{title}</label>
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          setFilter(e.target.value);
        }}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.title} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomFilter;
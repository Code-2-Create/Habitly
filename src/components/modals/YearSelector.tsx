import React from 'react';

interface YearSelectorProps {
  startYear: number;
  currentYear: number;
  selectedYear: number;
  onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ startYear, currentYear, selectedYear, onChange }) => {
  const years = [];
  for (let y = startYear; y <= currentYear; y++) {
    years.push(y);
  }

  return (
    <select 
      value={selectedYear} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-stone-50 border border-stone-200 text-stone-700 text-sm font-medium rounded-lg focus:ring-stone-500 focus:border-stone-500 block px-3 py-1.5 cursor-pointer outline-none"
    >
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  );
};

export default YearSelector;

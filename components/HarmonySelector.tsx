import React from 'react';
import { ColorHarmony } from '../constants';

interface HarmonySelectorProps {
  selectedHarmony: ColorHarmony;
  onHarmonyChange: (harmony: ColorHarmony) => void;
}

const HarmonySelector: React.FC<HarmonySelectorProps> = ({ selectedHarmony, onHarmonyChange }) => {
  const harmonies = Object.values(ColorHarmony);

  return (
    <div className="w-full p-4 h-full">
      <h3 className="text-lg font-bold mb-4 text-gray-300">Color Combination</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
        {harmonies.map((harmony) => (
          <button
            key={harmony}
            onClick={() => onHarmonyChange(harmony)}
            className={`w-full text-left p-2 rounded transition-colors duration-200 text-sm ${
              selectedHarmony === harmony
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {harmony}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HarmonySelector;

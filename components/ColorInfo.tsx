import React, { useState } from 'react';

// FIX: Define d3 namespace and types to resolve compilation errors.
declare namespace d3 {
  interface Color {
    h: number;
    s: number;
    l: number;
    copy(props?: { h?: number; s?: number; l?: number }): Color;
    formatHex(): string;
    rgb(): { r: number; g: number; b: number; opacity: number };
    toString(): string;
  }
  function hsl(h: number, s: number, l: number): Color;
  function hsl(color: any): Color;
}

interface ColorInfoProps {
  color: d3.Color;
}

const ColorInfo: React.FC<ColorInfoProps> = ({ color }) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(null), 2000);
    });
  };

  const hex = color.formatHex();
  const rgb = color.rgb();
  const hsl = d3.hsl(color);

  const rgbString = `${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}`;
  const hslString = `${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%`;

  const infoItems = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: rgbString },
    { label: 'HSL', value: hslString },
  ];

  return (
    <div className="bg-gray-700/50 p-4 rounded-md mt-6 w-full">
      <h3 className="text-base font-semibold mb-4 text-center text-gray-300 tracking-wide">Base Color</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        {infoItems.map(item => (
          <div key={item.label}>
            <span className="text-xs text-gray-400 uppercase">{item.label}</span>
            <button
              onClick={() => copyToClipboard(item.value)}
              className="w-full font-mono text-xs mt-1 py-2 px-1 sm:px-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap overflow-hidden text-ellipsis"
              title={`Copy ${item.value}`}
            >
              {copiedValue === item.value ? 'Copied!' : item.value}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorInfo;
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

interface PaletteDisplayProps {
  colors: d3.Color[];
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ colors }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  
  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {colors.map((color, index) => {
        const hex = color.formatHex();
        
        // Calculate perceived brightness using luminance formula for better contrast
        const rgb = color.rgb();
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
        const isLight = luminance > 128;
        
        const textColor = isLight ? 'text-black' : 'text-white';

        const isFirst = index === 0;
        const isLast = index === colors.length - 1;
        const roundClasses = isFirst && isLast 
          ? 'rounded-lg' 
          : isFirst 
          ? 'rounded-t-lg' 
          : isLast 
          ? 'rounded-b-lg' 
          : '';

        return (
          <div
            key={`${hex}-${index}`}
            className={`flex-grow flex items-center justify-center p-4 cursor-pointer group relative ${roundClasses}`}
            style={{ backgroundColor: hex }}
            onClick={() => handleCopy(hex)}
          >
            <div className="flex flex-col items-center">
              <span className={`font-mono font-semibold ${textColor} transition-opacity duration-300`}>
                {hex.toUpperCase()}
              </span>
              <span className={`text-xs mt-1 ${textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                {copiedHex === hex ? 'Copied!' : 'Click to copy'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaletteDisplay;
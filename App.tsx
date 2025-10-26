import React, { useState, useMemo, useRef, useEffect } from 'react';
import { HSLColor } from './types';
import { ColorHarmony } from './constants';
import ColorWheel from './components/ColorWheel';
import ColorInfo from './components/ColorInfo';
import HarmonySelector from './components/HarmonySelector';
import PaletteDisplay from './components/PaletteDisplay';
import { calculateHarmony } from './services/colorService';

declare const d3: any;

const App: React.FC = () => {
  const [baseColor, setBaseColor] = useState<HSLColor>({ h: 195, s: 0.85, l: 0.5 });
  const [harmony, setHarmony] = useState<ColorHarmony>(ColorHarmony.COMPLEMENTARY);

  const paletteContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const d3BaseColor = useMemo(() => {
    return d3.hsl(baseColor.h, baseColor.s, baseColor.l);
  }, [baseColor]);
  
  const currentPalette = useMemo(() => {
    return calculateHarmony(baseColor, harmony);
  }, [baseColor, harmony]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // On harmony change, scroll the palette into view so all colors are visible.
      paletteContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [harmony]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Teds Super-Fast Wheel</h1>
        <p className="text-gray-400 mt-2">An interactive tool to create beautiful color palettes.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 max-w-7xl mx-auto">
        
        {/* Color Wheel Section */}
        <div className="lg:col-span-2 bg-gray-700/30 p-1 rounded-xl shadow-lg">
          <div className="bg-gray-800 rounded-lg p-6 h-full flex flex-col items-center justify-center">
            <ColorWheel 
              color={baseColor} 
              onColorChange={setBaseColor}
              size={280}
            />
            <ColorInfo color={d3BaseColor} />
          </div>
        </div>

        {/* Harmonies and Palette Section */}
        <div className="lg:col-span-3 flex flex-col md:flex-row gap-4 md:gap-8">
          
          {/* Harmony Selector */}
          <div className="md:w-1/3 lg:w-2/5 bg-gray-700/30 p-1 rounded-xl shadow-lg">
            <div className="bg-gray-800 rounded-lg h-full">
              <HarmonySelector selectedHarmony={harmony} onHarmonyChange={setHarmony} />
            </div>
          </div>
          
          {/* Palette Display */}
          <div ref={paletteContainerRef} className="md:w-2/3 lg:w-3/5 flex bg-gray-700/30 p-1 rounded-xl shadow-lg">
            <div 
              className="bg-gray-800 rounded-lg w-full flex overflow-hidden"
              style={{ transform: 'translateZ(0)' }} // Fix for clipping issues on mobile browsers
            >
              <PaletteDisplay colors={currentPalette} />
            </div>
          </div>
        </div>

      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        &copy; TEDS WORLD PROJECTS Super-Fast Color Wheel v1.0
      </footer>
    </div>
  );
};

export default App;
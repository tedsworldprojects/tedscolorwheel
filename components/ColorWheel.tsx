import React, { useRef, useState, useCallback, useEffect } from 'react';
import { HSLColor } from '../types';

declare const d3: any;

interface ColorWheelProps {
  color: HSLColor;
  onColorChange: (newColor: HSLColor) => void;
  size?: number; // Acts as a max-size
}

const ColorWheel: React.FC<ColorWheelProps> = ({ color, onColorChange, size = 300 }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [actualSize, setActualSize] = useState(size);

  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.getBoundingClientRect().width;
        setActualSize(Math.min(parentWidth, size));
      }
    };
    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, [size]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const distance = Math.min(Math.sqrt(x * x + y * y), centerX);
    
    const saturation = distance / centerX;

    onColorChange({ ...color, h: angle, s: saturation });
  }, [color, onColorChange, actualSize]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e);
  }, [handleInteraction]);

  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleInteraction(e);
    }
  }, [isDragging, handleInteraction]);

  useEffect(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange({ ...color, l: parseFloat(e.target.value) });
  };

  const selectorX = (actualSize / 2) + (color.s * actualSize / 2) * Math.cos(color.h * Math.PI / 180);
  const selectorY = (actualSize / 2) + (color.s * actualSize / 2) * Math.sin(color.h * Math.PI / 180);
  
  const baseColorForGradient = d3.hsl(color.h, color.s, 0.5).toString();

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center space-y-4">
      <div
        ref={wheelRef}
        className="relative rounded-full cursor-pointer"
        style={{
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          background: `
            radial-gradient(circle, white, transparent),
            conic-gradient(from 90deg, 
              hsl(0, 100%, 50%), hsl(30, 100%, 50%), hsl(60, 100%, 50%), 
              hsl(90, 100%, 50%), hsl(120, 100%, 50%), hsl(150, 100%, 50%),
              hsl(180, 100%, 50%), hsl(210, 100%, 50%), hsl(240, 100%, 50%),
              hsl(270, 100%, 50%), hsl(300, 100%, 50%), hsl(330, 100%, 50%),
              hsl(360, 100%, 50%)
            )
          `,
          touchAction: 'none'
        }}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div 
          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${selectorX - 10}px`,
            top: `${selectorY - 10}px`,
            backgroundColor: d3.hsl(color.h, color.s, color.l).toString(),
            pointerEvents: 'none'
          }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={color.l}
        onChange={handleLightnessChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #000, ${baseColorForGradient}, #fff)` }}
      />
    </div>
  );
};

export default ColorWheel;
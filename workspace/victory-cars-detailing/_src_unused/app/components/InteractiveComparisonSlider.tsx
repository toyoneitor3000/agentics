'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: string;
  theme?: string;
}

/**
 * Improved before/after comparison slider.
 * - Uses CSS clip‑path for a clean reveal without resizing images.
 * - Supports mouse, touch, and keyboard (range input) interactions.
 * - Adds subtle hover effects and a more polished handle.
 */
export const ComparisonSlider = ({
  beforeImage,
  afterImage,
  label,
  theme,
}: ComparisonSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<string>(null);
  const [position, setPosition] = useState(50); // 0‑100 %
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Update position based on mouse / touch coordinates
  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const percent = ((clientX - left) / width) * 100;
    setPosition(Math.min(Math.max(percent, 0), 100));
    if (themeLoaded) {
      setThemeLoaded(false);
      setTheme(theme);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    setThemeLoaded(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setThemeLoaded(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
    setThemeLoaded(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setThemeLoaded(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
    if (themeLoaded) {
      setThemeLoaded(false);
      setTheme(theme);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    updatePosition(touch.clientX);
    if (themeLoaded) {
      setThemeLoaded(false);
      setTheme(theme);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
    if (themeLoaded) {
      setThemeLoaded(false);
      setTheme(theme);
    }
  };

  useEffect(() => {
    const imgs = containerRef.current?.querySelectorAll('img');
    imgs?.forEach((img) => (img.draggable = false));
    if (themeLoaded) {
      setThemeLoaded(false);
      setTheme(theme);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-12 select-none">
      {label && (
        <h3 className="text-2xl text-center mb-6 text-brand-cyan font-orbitron tracking-wide text-glow">
          {label}
        </h3>
      )}

      <div
        className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        {/* After image – full background */}
        <div className="absolute inset-0">
          <Image src={afterImage} alt="After" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-brand-cyan px-3 py-1 rounded text-sm font-bold tracking-widest font-orbitron">
            DESPUÉS
          </div>
        </div>

        {/* Before image – clipped with clip‑path */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
          }}
        >
          <Image src={beforeImage} alt="Before" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded text-sm font-bold tracking-widest font-orbitron">
            ANTES
          </div>
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-brand-cyan via-brand-mid-blue to-brand-cyan z-20 flex items-center justify-center cursor-ew-resize"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="bg-gradient-to-br from-brand-cyan to-brand-mid-blue p-3 rounded-full text-brand-dark-blue shadow-2xl hover:scale-110 transition-all duration-200 cursor-grab active:cursor-grabbing">
            <div className="flex items-center space-x-1">
              <ChevronLeft size={16} className="text-white" />
              <div className="w-1 h-6 bg-white/80 rounded-full" />
              <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Hidden range input for keyboard users */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={handleRangeChange}
          className="sr-only"
          aria-label="Slider position"
        />
      </div>
    </div>
  );
};

export default ComparisonSlider;

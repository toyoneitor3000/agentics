'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalMs = interval ?? 5000; // Use provided interval or default to 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={image}
            alt={`Carousel Image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0} // Prioritize loading the first image
          />
        </div>
      ))}

      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          onClick={goToPrevious}
          className='bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none'
        >
          &#10094;
        </button>
        <button
          onClick={goToNext}
          className='bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none'
        >
          &#10095;
        </button>
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

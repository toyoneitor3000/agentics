'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='relative w-full h-full overflow-hidden'>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark-blue to-brand-mid-blue z-10"></div>
      )}

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={index === 0 ? 90 : 85} // Higher quality for first image
            onLoad={index === 0 ? handleImageLoad : undefined}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          onClick={goToPrevious}
          className='bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-20'
          aria-label="Previous image"
        >
          &#10094;
        </button>
        <button
          onClick={goToNext}
          className='bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none z-20'
          aria-label="Next image"
        >
          &#10095;
        </button>
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'
              }`}
            aria-label={`Go to image ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

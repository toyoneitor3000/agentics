import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  rating: number; // 1 to 5
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, rating }) => {
  return (
    <div className="bg-brand-mid-blue p-8 rounded-xl border border-white/5 relative hover:border-brand-cyan/30 transition-colors duration-300">
      <Quote className="absolute top-4 right-4 text-brand-cyan/10" size={48} />
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? '#06b6d4' : 'none'}
            className={i < rating ? 'text-brand-cyan' : 'text-brand-slate/30'}
          />
        ))}
      </div>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <p className="text-brand-slate text-lg italic mb-6 leading-relaxed font-light">"{quote}"</p>
      <div className="flex items-center">
          <div className="w-10 h-10 bg-brand-dark-blue border border-white/10 rounded-full mr-3 flex items-center justify-center text-brand-cyan font-bold font-orbitron">
              {author.charAt(0)}
          </div>
          <p className="font-semibold text-white font-orbitron tracking-wide">{author}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;

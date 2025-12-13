'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { COLOMBIAN_CITIES } from '@/app/data/colombia-cities';

interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function LocationInput({ value, onChange, className = '' }: LocationInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        if (searchTerm.length > 0 && isOpen) {
            const filtered = COLOMBIAN_CITIES.filter(city =>
                city.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities(COLOMBIAN_CITIES);
        }
    }, [searchTerm, isOpen]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (city: string) => {
        onChange(city);
        setSearchTerm(city);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(newValue); // Allow free text as well
        setIsOpen(true);
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Buscar ciudad..."
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#FF9800] transition-colors"
                />
                <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {isOpen && filteredCities.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 max-h-60 overflow-y-auto bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-50">
                    {filteredCities.map((city, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(city)}
                            className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#FF9800] hover:text-black transition-colors border-b border-white/5 last:border-0"
                        >
                            {city}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

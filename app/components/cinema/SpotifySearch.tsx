"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Music, X, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { searchSpotifyTrack } from '@/app/actions/spotify';

interface SpotifySearchProps {
    onSelect: (track: any) => void;
    initialTrack?: any;
}

export default function SpotifySearch({ onSelect, initialTrack }: SpotifySearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any>(initialTrack || null);
    const [isOpen, setIsOpen] = useState(false);

    // Sync externally provided track
    useEffect(() => {
        if (initialTrack) {
            setSelectedTrack(initialTrack);
        }
    }, [initialTrack]);

    // Debounce
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length >= 2) {
                setIsSearching(true);
                const tracks = await searchSpotifyTrack(query);
                setResults(tracks);
                setIsSearching(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (track: any) => {
        setSelectedTrack(track);
        onSelect(track);
        setIsOpen(false);
        setQuery('');
    };

    const clearSelection = () => {
        setSelectedTrack(null);
        onSelect(null);
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Music className="w-3 h-3" /> Soundtrack
            </label>

            {!selectedTrack ? (
                <div className="relative z-20">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar canción en Spotify..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#1DB954] text-sm transition-colors"
                    />
                    <Search className="w-5 h-5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />

                    {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-[#1DB954] animate-spin" />
                        </div>
                    )}

                    {/* DROPDOWN RESULTS */}
                    {isOpen && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 z-50">
                            {results.map((track) => (
                                <button
                                    key={track.id}
                                    onClick={() => handleSelect(track)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0"
                                >
                                    <div className="w-10 h-10 bg-black/50 rounded flex-shrink-0 relative overflow-hidden">
                                        {track.cover ? (
                                            <Image src={track.cover} alt={track.name} fill className="object-cover" />
                                        ) : (
                                            <Music className="w-5 h-5 text-white/20 m-auto" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-white truncate">{track.name}</h4>
                                        <p className="text-xs text-white/50 truncate">{track.artist}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* SELECTED TRACK CARD */
                <div className="flex items-center gap-4 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-xl p-3 animate-in fade-in zoom-in-95 group">
                    <div className="w-12 h-12 bg-black/50 rounded-lg relative overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        {selectedTrack.cover ? (
                            <Image src={selectedTrack.cover} alt={selectedTrack.name} fill className="object-cover" />
                        ) : (
                            <Music className="w-6 h-6 text-[#1DB954] m-auto" />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Music className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                        <input
                            type="text"
                            value={selectedTrack.name}
                            onChange={(e) => {
                                const updated = { ...selectedTrack, name: e.target.value };
                                setSelectedTrack(updated);
                                onSelect(updated);
                            }}
                            className="w-full bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 focus:outline-none placeholder:text-white/20"
                            placeholder="Nombre de la canción"
                        />
                        <input
                            type="text"
                            value={selectedTrack.artist}
                            onChange={(e) => {
                                const updated = { ...selectedTrack, artist: e.target.value };
                                setSelectedTrack(updated);
                                onSelect(updated);
                            }}
                            className="w-full bg-transparent border-none p-0 text-xs text-[#1DB954] font-medium focus:ring-0 focus:outline-none placeholder:text-[#1DB954]/20"
                            placeholder="Artista"
                        />
                    </div>
                    <button
                        onClick={clearSelection}
                        className="w-8 h-8 rounded-full bg-black/20 hover:bg-red-500/20 text-white/50 hover:text-red-500 flex items-center justify-center transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

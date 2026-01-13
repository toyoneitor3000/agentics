"use client";

import { Check, Crown, ShieldCheck, Briefcase, Star, Trophy, Zap, User, Monitor, Shield } from 'lucide-react';

/*
  JERARQUÍA DE INSIGNIAS (SPEEDLIGHT CULTURE v2)
  
  Multibadge System:
  - Founder: Permanent (Medal/Star) - Indigo
  - CEO: Amber/Gold w/ Shield
  - Sponsor: Red w/ Star
  - Elite: Yellow w/ Trophy
  - Builder: Orange w/ Zap
  - Rookie: Blue w/ User
*/

type UserRole = 'CEO' | 'Sponsor' | 'Elite Racer' | 'Builder' | 'Rookie' | string;

interface UserBadgeProps {
    role?: UserRole;
    founderNumber?: number;
    email?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function UserBadge({ role, founderNumber, email, size = 'sm', showLabel = true }: UserBadgeProps) {

    const badges = [];

    // GOD MODE Check
    const isGodMode = email === 'speedlightculture@gmail.com';

    // 1. Founder Check (Permanent)
    if ((founderNumber && founderNumber <= 500) || isGodMode) {
        badges.push({
            id: 'founder',
            label: 'Founder',
            icon: Star, // Or Medal
            style: 'bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/50 shadow-[0_0_10px_rgba(255,152,0,0.2)]'
        });
    }

    // 2. Role Check
    const r = role || 'Rookie';

    if (r === 'CEO' || isGodMode) {
        badges.push({ id: 'ceo', label: 'CEO', icon: Shield, style: 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.4)]' });
    }

    if (r === 'Sponsor' || isGodMode) {
        badges.push({ id: 'sponsor', label: 'Sponsor', icon: Star, style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50' });
    }

    if (r === 'Elite Racer' && !isGodMode) {
        badges.push({ id: 'elite', label: 'Elite', icon: Trophy, style: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/50' });
    }

    if (r === 'Builder' && !isGodMode) {
        badges.push({ id: 'builder', label: 'Builder', icon: Zap, style: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/50' });
    }

    // Rookie only appears if no other ROLE is present AND not God Mode
    const hasSuperiorRole2 = badges.some(b => ['ceo', 'sponsor', 'elite', 'builder'].includes(b.id));

    if (!hasSuperiorRole2 && !isGodMode) {
        if (r === 'Rookie' || !r) {
            badges.push({ id: 'rookie', label: 'Rookie', icon: User, style: 'bg-blue-500/10 text-blue-400 border-blue-500/50' });
        }
    }

    return (
        <div className={`flex flex-wrap items-center gap-2 justify-center ${size === 'sm' ? '' : 'mt-1'}`}>
            {badges.map(b => (
                <div
                    key={b.id}
                    className={`inline-flex items-center gap-1.5 border rounded-full backdrop-blur-md ${b.style} ${size === 'sm' ? 'text-[9px] py-0.5 px-2' : 'text-[10px] py-1 px-3'}`}
                >
                    <b.icon className={size === 'sm' ? "w-2.5 h-2.5" : "w-3 h-3"} />
                    {showLabel && <span className="font-bold uppercase tracking-wider">{b.label}</span>}
                </div>
            ))}
        </div>
    );
}

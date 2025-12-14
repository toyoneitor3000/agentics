"use client";

import { Check, Crown, ShieldCheck, Briefcase } from 'lucide-react';

/*
  JERARQUÍA DE INSIGNIAS (SPEEDLIGHT CULTURE)
  
  1. CEO (Staff): Rojo-Amarillo (Fuego/Luz)
  2. Fundador (Club 500): Naranja Speedlight
  3. Official Business (Verificado): Cian/Turquesa (Contraste Tecnológico)
  4. Business (Silver): Gris Metálico / Café Claro
*/

type UserRole = 'ceo' | 'founder' | 'business_verified' | 'business' | 'pro' | 'user';

interface UserBadgeProps {
    role?: UserRole | string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean; // Si queremos que diga "CEO" o solo el icono
}

export function UserBadge({ role = 'user', size = 'sm', showLabel = false }: UserBadgeProps) {

    // Normalizar rol por si viene de DB como texto
    let normalizedRole = role.toLowerCase();

    // Lógica de Renderizado
    if (normalizedRole === 'ceo' || normalizedRole === 'admin') {
        return (
            <BadgeContainer
                color="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
                glow="shadow-[0_0_10px_rgba(255,87,34,0.6)]"
                size={size}
                label={showLabel ? "CEO" : undefined}
            >
                <Crown className="text-white fill-white" />
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'founder' || normalizedRole === 'club500') {
        return (
            <BadgeContainer
                color="bg-[#FF9800]"
                glow="shadow-[0_0_8px_rgba(255,152,0,0.4)]"
                size={size}
                label={showLabel ? "Club 500" : undefined}
            >
                <span className="font-bold font-serif italic text-black">F</span>
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'official_business' || normalizedRole === 'verified_business') {
        return (
            <BadgeContainer
                color="bg-cyan-500"
                glow="shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                size={size}
                label={showLabel ? "Official" : undefined}
            >
                <ShieldCheck className="text-black" />
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'business') {
        return (
            <BadgeContainer
                color="bg-neutral-400"
                glow=""
                size={size}
                label={showLabel ? "Business" : undefined}
            >
                <Briefcase className="text-black" />
            </BadgeContainer>
        );
    }

    // Pro User (Suscripción)
    if (normalizedRole === 'pro') {
        return (
            <BadgeContainer
                color="bg-purple-600"
                glow="shadow-[0_0_8px_rgba(147,51,234,0.4)]"
                size={size}
            >
                <Check className="text-white" />
            </BadgeContainer>
        )
    }

    return null; // Usuario normal no tiene badge por defecto
}

// Sub-componente interno para estilos
function BadgeContainer({ children, color, glow, size, label }: any) {
    const sizeClasses = {
        sm: "w-3.5 h-3.5 p-0.5",
        md: "w-5 h-5 p-1",
        lg: "w-6 h-6 p-1.5"
    };

    const iconSizes = {
        sm: "w-full h-full",
        md: "w-full h-full",
        lg: "w-full h-full"
    };

    return (
        <div className="inline-flex items-center gap-1.5 align-middle ml-1">
            <div className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-full ${color} ${glow} flex items-center justify-center`}>
                <div className={`${iconSizes[size as keyof typeof sizeClasses]}`}>
                    {children}
                </div>
            </div>
            {label && (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${color.replace('bg-', 'text-')} opacity-90`}>
                    {label}
                </span>
            )}
        </div>
    );
}

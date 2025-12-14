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

// Sub-componente interno para estilos
function BadgeContainer({ children, colorClass, glow, size, label }: any) {
    const sizeClasses = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <div className="inline-flex items-center gap-1.5 align-middle ml-1.5">
            {/* Icono sin background, solo el SVG con color */}
            <div className={`${sizeClasses[size as keyof typeof sizeClasses]} ${colorClass} ${glow} flex items-center justify-center`}>
                {children}
            </div>

            {/* Etiqueta de Texto Minimalista */}
            {label && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
                    {label}
                </span>
            )}
        </div>
    );
}

export function UserBadge({ role = 'user', size = 'sm', showLabel = false }: UserBadgeProps) {

    // Normalizar rol por si viene de DB como texto
    let normalizedRole = role.toLowerCase();

    // Lógica de Renderizado Minimalista
    if (normalizedRole === 'ceo' || normalizedRole === 'admin') {
        return (
            <BadgeContainer
                colorClass="text-yellow-500" // Dorado simple
                glow="drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"
                size={size}
                label={showLabel ? "CEO" : undefined}
            >
                <Crown className="w-full h-full fill-yellow-500" />
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'founder' || normalizedRole === 'club500') {
        return (
            <BadgeContainer
                colorClass="text-[#FF9800]"
                glow="drop-shadow-[0_0_5px_rgba(255,152,0,0.4)]"
                size={size}
                label={showLabel ? "Club 500" : undefined}
            >
                <Crown className="w-full h-full" />
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'official_business' || normalizedRole === 'verified_business') {
        return (
            <BadgeContainer
                colorClass="text-cyan-400"
                glow="drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]"
                size={size}
                label={showLabel ? "Official" : undefined}
            >
                <ShieldCheck className="w-full h-full" />
            </BadgeContainer>
        );
    }

    if (normalizedRole === 'business') {
        return (
            <BadgeContainer
                colorClass="text-neutral-400"
                glow=""
                size={size}
                label={showLabel ? "Business" : undefined}
            >
                <Briefcase className="w-full h-full" />
            </BadgeContainer>
        );
    }

    return null;
}

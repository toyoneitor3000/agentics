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
function BadgeContainer({ children, className, glow, size, label, textColor = "text-white" }: any) {
    const isSmall = size === 'sm';

    // Ajustes de tamaño
    const sizeClasses = {
        sm: "h-auto gap-1", // Compacto para header
        md: "h-6 px-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full", // Badge completo para perfiles (Sin borde)
        lg: "h-7 px-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full"
    };

    // Si es pequeño (Header), renderizamos solo texto e icono sin fondo
    if (isSmall) {
        return (
            <div className={`inline-flex items-center gap-1.5 align-middle ml-2 ${className}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider text-[#FF9800]`}>
                    {label}
                </span>
                <div className="w-3 h-3 text-[#FF9800]">
                    {children}
                </div>
            </div>
        );
    }

    // Versión Full (Perfil)
    return (
        <div className={`inline-flex items-center gap-1.5 align-middle ml-2 ${className} ${sizeClasses[size as 'sm' | 'md' | 'lg']} ${glow}`}>
            {/* Icono */}
            <div className="w-3.5 h-3.5 flex items-center justify-center text-white">
                {children}
            </div>
            {/* Etiqueta */}
            {label && (
                <span className={`text-[10px] font-black uppercase tracking-wider ${textColor} leading-none pt-0.5`}>
                    {label}
                </span>
            )}
        </div>
    );
}

export function UserBadge({ role = 'user', size = 'sm', showLabel = false }: UserBadgeProps) {

    // Normalizar rol por si viene de DB como texto
    let normalizedRole = role.toLowerCase();

    // 1. CEO (Minimal en Header, Full en Perfil)
    if (normalizedRole === 'ceo' || normalizedRole === 'admin') {
        return (
            <BadgeContainer
                size={size}
                label="CEO"
                // En versiones grandes (md/lg) el fondo lo maneja el sizeClasses dentro del componente
                // En versiones pequeñas (sm) esto se ignora por el if(isSmall)
                glow="shadow-[0_0_15px_rgba(255,87,34,0.4)]"
                textColor="text-white"
            >
                <Crown className="w-full h-full fill-current" />
            </BadgeContainer>
        );
    }

    // 2. FUNDADOR / CLUB 500
    if (normalizedRole === 'founder' || normalizedRole === 'club500') {
        return (
            <BadgeContainer
                className="bg-[#FF9800]/10 border-[#FF9800]/50"
                glow="shadow-[0_0_10px_rgba(255,152,0,0.2)]"
                size={size}
                label={showLabel ? "Founder" : undefined}
                textColor="text-[#FF9800]"
            >
                <Crown className="w-full h-full" />
            </BadgeContainer>
        );
    }

    // 3. NEGOCIO OFICIAL
    if (normalizedRole === 'official_business' || normalizedRole === 'verified_business') {
        return (
            <BadgeContainer
                className="bg-cyan-500/10 border-cyan-400/50"
                glow="shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                size={size}
                label={showLabel ? "Official" : undefined}
                textColor="text-cyan-400"
            >
                <ShieldCheck className="w-full h-full" />
            </BadgeContainer>
        );
    }

    // 4. NEGOCIO NORMAL
    if (normalizedRole === 'business') {
        return (
            <BadgeContainer
                className="bg-white/5 border-white/20"
                glow=""
                size={size}
                label={showLabel ? "Business" : undefined}
                textColor="text-neutral-400"
            >
                <Briefcase className="w-full h-full" />
            </BadgeContainer>
        );
    }

    return null;
}

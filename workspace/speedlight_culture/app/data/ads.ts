
export type AdType = 'hero_sponsor' | 'feed_card' | 'sidebar_spec' | 'workshop_badge' | 'academy_intro';

export interface AdCampaign {
    id: string;
    type: AdType;
    clientName: string;
    isActive: boolean;
    content: {
        title?: string; // For Feed, Sidebar
        subtitle?: string; // For Sidebar
        description?: string; // For Feed, Sidebar
        brandName?: string; // For Hero, Workshop, Intro
        logoText?: string; // Text fallback for logo
        badgeText?: string; // "Partner", "Verified", etc.
        ctaText?: string;
        ctaLink: string;
        imageUrl?: string; // Main image
        iconUrl?: string; // Small badge icon
        specs?: { label: string; value: string }[]; // For Sidebar Spec
        rating?: string; // For Workshop/Spec
    };
    styling?: {
        highlightColor?: string; // e.g. #FF9800
    };
}

// "BASE DE DATOS" SIMULADA
// Aquí es donde "llenamos el formulario" para que el demo desaparezca y entre el cliente real.
export const activeCampaigns: AdCampaign[] = [
    {
        id: 'camp_001',
        type: 'hero_sponsor',
        clientName: 'Brembo',
        isActive: true,
        content: {
            brandName: 'BREMBO',
            ctaLink: 'https://www.brembo.com',
            logoText: 'BREMBO'
        }
    },
    {
        id: 'camp_002',
        type: 'feed_card',
        clientName: 'Motul',
        isActive: true,
        content: {
            brandName: 'Motul Colombia',
            title: 'Kit Sintético 8100',
            description: 'Maximiza el rendimiento con la fórmula 100% sintética. Oferta exclusiva para miembros.',
            badgeText: 'Partner Speedlight',
            ctaText: 'Ver Oferta',
            ctaLink: '/marketplace/motul-8100',
            imageUrl: 'https://images.unsplash.com/photo-1596425121695-1262d5a37466?q=80&w=1000&auto=format&fit=crop', // Engine oil placeholder
        }
    },
    {
        id: 'camp_003',
        type: 'sidebar_spec',
        clientName: 'Michelin',
        isActive: true,
        content: {
            title: 'PS4S',
            subtitle: 'Michelin Pilot Sport',
            description: 'Maximum grip for street and track.',
            specs: [
                { label: 'Wet Braking', value: 'Class A' },
                { label: 'Durability', value: '30k Miles' }
            ],
            rating: '9.8',
            ctaLink: 'https://michelin.com',
            ctaText: 'Ver Ficha Técnica'
        }
    },
    {
        id: 'camp_004',
        type: 'workshop_badge',
        clientName: 'Lavafante',
        isActive: true,
        content: {
            brandName: 'Lavafante Detailing',
            description: 'Corrección de Pintura & PPF',
            badgeText: 'Verified',
            rating: 'TOP RATED',
            ctaLink: '/workshops/lavafante'
        }
    },
    {
        id: 'camp_005',
        type: 'academy_intro',
        clientName: 'Toyotech',
        isActive: true,
        content: {
            brandName: 'TOYOTECH',
            subtitle: 'Performance Parts',
            badgeText: 'Powered By',
            ctaLink: 'https://toyotech.co'
        }
    },
    {
        id: 'camp_006',
        type: 'feed_card',
        clientName: 'SpeedlightAcademy',
        isActive: true,
        content: {
            brandName: 'Speedlight Academy',
            title: '¿Te gusta este proyecto?',
            description: 'Aprende a construir el tuyo desde cero con nuestros profesionales. Mecánica, Pintura y Tuning.',
            badgeText: 'Education',
            ctaText: 'Ver Cursos',
            ctaLink: 'https://speedlightacademy.com',
            imageUrl: '/images/ads/academy-promo.jpg',
        },
        styling: {
            highlightColor: '#D32F2F' // Red branding for Academy
        }
    }
];

export function getAdByType(type: AdType): AdCampaign | undefined {
    return activeCampaigns.find(ad => ad.type === type && ad.isActive);
}

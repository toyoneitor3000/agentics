import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bonos de Regalo | Victory Cars Detailing',
    description: 'Obtén un 20% de Descuento en servicios seleccionados. ¡Reclama tu bono exclusivo ahora!',
    openGraph: {
        title: '¡Tu Bono de 20% OFF te espera!',
        description: 'Mejora la estética de tu vehículo con los expertos. Reclama tu descuento exclusivo hoy mismo.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '¡Tu Bono de 20% OFF te espera!',
        description: 'Mejora la estética de tu vehículo con los expertos. Reclama tu descuento exclusivo hoy mismo.',
    },
};

export default function PromocionesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

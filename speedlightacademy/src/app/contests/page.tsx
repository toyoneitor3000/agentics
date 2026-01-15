import React from 'react';
import { ContestCard } from '@/components/contests/ContestCard';
import { AdFeedCard } from '@/components/AdBanners';
import { CTABanner } from '@/components/ui/CTABanner';
import styles from './contests.module.css';

const CONTESTS = [
    {
        id: '1',
        title: 'Foto de la Semana #42',
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80',
        status: 'Activo' as const,
        deadline: 'Este Domingo',
        participants: 45,
        prizes: 'Mención Destacada'
    },
    {
        id: '2',
        title: 'Foto del Mes: Speedlight Vibes',
        image: 'https://images.unsplash.com/photo-1493238792015-164e8502561d?auto=format&fit=crop&q=80',
        status: 'Activo' as const,
        deadline: '30 de este mes',
        participants: 120,
        prizes: 'Kit de Merch + Entrevista'
    },
    {
        id: '3',
        title: 'Foto del Año: Los 5 Pilares',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80',
        status: 'Próximo' as const,
        deadline: 'Diciembre 2025',
        participants: 0,
        prizes: 'Trofeo Anual + Equipo Fotográfico'
    }
];

export default function ContestsPage() {
    return (
        <div className={styles.container}>
            {/* Background decoration */}
            <div className={styles.blob} />

            <header className={styles.hero}>
                <h1 className={styles.title}>
                    Desafía los <span className={styles.highlight}>Límites</span>
                </h1>
                <p className={styles.description}>
                    Participa en los eventos oficiales de la comunidad. Desde la mejor foto de la semana hasta el prestigioso galardón del año.
                </p>
            </header>

            <div className={styles.grid}>
                {CONTESTS.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                ))}
                <div style={{ gridColumn: 'span 1' }}>
                    <AdFeedCard />
                </div>
            </div>

            <CTABanner
                title="¿Tienes la mejor toma?"
                description="Sube tu foto, selecciona la categoría y compite contra los mejores fotógrafos de la región."
                buttonText="Postular Foto"
                buttonLink="/contests/submit"
                backgroundImage="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80"
            />
        </div>
    );
}

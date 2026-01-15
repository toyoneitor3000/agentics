import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from './ContestCard.module.css';

interface ContestProps {
    id: string;
    title: string;
    image: string;
    status: 'Activo' | 'Próximo' | 'Finalizado';
    deadline: string;
    participants: number;
    prizes: string;
}

export const ContestCard = ({ contest }: { contest: ContestProps }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder} style={{ backgroundImage: `url(${contest.image})` }} />
                <span className={`${styles.status} ${styles[contest.status.toLowerCase()]}`}>
                    {contest.status === 'Activo' ? '🟢 En curso' : contest.status === 'Próximo' ? '🟡 Próximamente' : '🔴 Finalizado'}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{contest.title}</h3>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Cierre de inscripciones</span>
                        <span className={styles.value}>{contest.deadline}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}>Participantes</span>
                        <span className={styles.value}>{contest.participants}</span>
                    </div>
                </div>

                <div className={styles.prizeSection}>
                    <span className={styles.prizeLabel}>🏆 Premios</span>
                    <p className={styles.prizeValue}>{contest.prizes}</p>
                </div>

                <div className={styles.footer}>
                    <Button
                        fullWidth
                        variant={contest.status === 'Finalizado' ? 'outline' : 'primary'}
                        disabled={contest.status === 'Finalizado'}
                    >
                        {contest.status === 'Activo' ? 'Inscribirse Ahora' : contest.status === 'Próximo' ? 'Ver Detalles' : 'Ver Ganadores'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

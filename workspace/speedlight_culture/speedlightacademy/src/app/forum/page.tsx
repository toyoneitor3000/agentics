import React from 'react';
import { Button } from '@/components/ui/Button';
import { ForumCategoryCard } from '@/components/forum/ForumCategoryCard';
import { ForumTopicRow } from '@/components/forum/ForumTopicRow';
import styles from './forum.module.css';

const CATEGORIES = [
    {
        id: '1',
        name: 'Mecánica General',
        description: 'Dudas, reparaciones y mantenimiento preventivo.',
        icon: '🔧',
        topicCount: 1540
    },
    {
        id: '2',
        name: 'Modificaciones & Tuning',
        description: 'Proyectos, reprogramaciones y mejoras de performance.',
        icon: '🚀',
        topicCount: 890
    },
    {
        id: '3',
        name: 'Detailing & Estética',
        description: 'Técnicas de lavado, pulido y protección de pintura.',
        icon: '✨',
        topicCount: 430
    },
    {
        id: '4',
        name: 'Eventos & Encuentros',
        description: 'Organización de rodadas y cobertura de eventos.',
        icon: '📅',
        topicCount: 210
    }
];

const RECENT_TOPICS = [
    {
        id: '1',
        title: 'GUÍA: Cómo elegir el turbo correcto para tu proyecto',
        author: 'Admin',
        category: 'Modificaciones',
        replies: 45,
        views: 1205,
        lastActivity: 'hace 2h',
        isPinned: true
    },
    {
        id: '2',
        title: 'Problema con ralentí inestable en Subaru WRX',
        author: 'JDM_Lover',
        category: 'Mecánica',
        replies: 12,
        views: 340,
        lastActivity: 'hace 5m'
    },
    {
        id: '3',
        title: '¿Alguien ha probado los ceramic coating de gama media?',
        author: 'DetailMaster',
        category: 'Detailing',
        replies: 28,
        views: 560,
        lastActivity: 'hace 1h'
    },
    {
        id: '4',
        title: 'Fotos de la rodada nocturna del fin de semana',
        author: 'NightRider',
        category: 'Eventos',
        replies: 8,
        views: 190,
        lastActivity: 'hace 3h'
    },
    {
        id: '5',
        title: 'Consulta sobre llantas semi-slick para calle',
        author: 'TrackDad',
        category: 'Modificaciones',
        replies: 15,
        views: 410,
        lastActivity: 'hace 5h'
    }
];

export default function ForumPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Foro Comunitario</h1>
                    <p className={styles.subtitle}>
                        El espacio para compartir conocimiento y pasión por los motores.
                    </p>
                </div>
                <Button>+ Crear Nuevo Tema</Button>
            </header>

            <section>
                <h2 className={styles.sectionTitle}>Categorías</h2>
                <div className={styles.categoriesGrid}>
                    {CATEGORIES.map((cat) => (
                        <ForumCategoryCard key={cat.id} category={cat} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className={styles.sectionTitle}>Discusiones Recientes 🔥</h2>
                <div className={styles.topicList}>
                    {RECENT_TOPICS.map((topic) => (
                        <ForumTopicRow key={topic.id} topic={topic} />
                    ))}
                </div>
            </section>
        </div>
    );
}

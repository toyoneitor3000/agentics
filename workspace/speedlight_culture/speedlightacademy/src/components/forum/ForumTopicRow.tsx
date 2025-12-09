import React from 'react';
import styles from './ForumTopicRow.module.css';

interface TopicProps {
    id: string;
    title: string;
    author: string;
    category: string;
    replies: number;
    views: number;
    lastActivity: string;
    isPinned?: boolean;
}

export const ForumTopicRow = ({ topic }: { topic: TopicProps }) => {
    return (
        <div className={`${styles.row} ${topic.isPinned ? styles.pinned : ''}`}>
            <div className={styles.mainInfo}>
                {topic.isPinned && <span className={styles.pinIcon}>📌</span>}
                <div>
                    <h4 className={styles.title}>{topic.title}</h4>
                    <span className={styles.meta}>
                        <span className={styles.categoryBadge}>{topic.category}</span>
                        <span className={styles.author}>por {topic.author}</span>
                    </span>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>{topic.replies}</span>
                    <span className={styles.statLabel}>Respuestas</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>{topic.views}</span>
                    <span className={styles.statLabel}>Vistas</span>
                </div>
            </div>

            <div className={styles.activity}>
                {topic.lastActivity}
            </div>
        </div>
    );
};

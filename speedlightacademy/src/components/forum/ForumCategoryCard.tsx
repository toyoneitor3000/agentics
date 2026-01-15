import React from 'react';
import styles from './ForumCategoryCard.module.css';

interface CategoryProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    topicCount: number;
}

export const ForumCategoryCard = ({ category }: { category: CategoryProps }) => {
    return (
        <div className={styles.card}>
            <div className={styles.icon}>{category.icon}</div>
            <div className={styles.content}>
                <h3 className={styles.title}>{category.name}</h3>
                <p className={styles.description}>{category.description}</p>
                <span className={styles.stat}>{category.topicCount} temas</span>
            </div>
        </div>
    );
};

import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const Card = ({ children, className = '', hoverEffect = false, ...props }: CardProps) => {
    return (
        <div className={`${styles.card} ${hoverEffect ? styles.hover : ''} ${className}`} {...props}>
            {children}
        </div>
    );
};

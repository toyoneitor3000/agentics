import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from './CTABanner.module.css';
import Link from 'next/link';

interface CTABannerProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage?: string;
}

export const CTABanner = ({
    title,
    description,
    buttonText,
    buttonLink,
    backgroundImage
}: CTABannerProps) => {
    return (
        <div className={styles.banner} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.description}>{description}</p>
                <Link href={buttonLink}>
                    <Button size="lg" className={styles.button}>{buttonText}</Button>
                </Link>
            </div>
        </div>
    );
};

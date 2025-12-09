import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './ProductCard.module.css';

interface ProductProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    condition: 'Nuevo' | 'Usado';
    seller: string;
}

export const ProductCard = ({ product }: { product: ProductProps }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {/* Placeholder for real image implementation later */}
                <div className={styles.imagePlaceholder} style={{ backgroundImage: `url(${product.image})` }} />
                <span className={styles.badge}>{product.condition}</span>
                <button className={styles.favoriteBtn} aria-label="Añadir a favoritos">
                    ♥
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.category}>{product.category}</div>
                <Link href={`/marketplace/${product.id}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{product.title}</h3>
                </Link>
                <div className={styles.price}>${product.price.toLocaleString()}</div>

                <div className={styles.footer}>
                    <span className={styles.seller}>Por {product.seller}</span>
                    <Button size="sm" variant="outline" className={styles.actionBtn}>
                        Ver
                    </Button>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { CTABanner } from '@/components/ui/CTABanner';
import styles from './marketplace.module.css';

// Mock Data
const PRODUCTS = [
    {
        id: '1',
        title: 'Kit Turbo Garrett GT2860R Ball Bearing',
        price: 1250,
        image: 'https://images.unsplash.com/photo-1626322967672-8f92163351ec?auto=format&fit=crop&q=80',
        category: 'Performance',
        condition: 'Nuevo' as const,
        seller: 'SpeedShop Bogota'
    },
    {
        id: '2',
        title: 'Suspension Coilovers Tein Street Advance Z',
        price: 890,
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80',
        category: 'Suspensión',
        condition: 'Nuevo' as const,
        seller: 'JDM Imports'
    },
    {
        id: '3',
        title: 'Rines Volk Racing TE37 18x9.5 +22',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1579361685820-2c70d7ee8fd3?auto=format&fit=crop&q=80',
        category: 'Rines',
        condition: 'Usado' as const,
        seller: 'Carlos Drift'
    },
    {
        id: '4',
        title: 'Servicio de Tuning ECU (Reprogramación)',
        price: 450,
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80',
        category: 'Servicios',
        condition: 'Nuevo' as const,
        seller: 'DynoTech'
    },
    {
        id: '5',
        title: 'Frenos Brembo 6 Pistones Kit Completo',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1527383214149-32488f8d6938?auto=format&fit=crop&q=80',
        category: 'Frenos',
        condition: 'Usado' as const,
        seller: 'Racing Parts Col'
    },
    {
        id: '6',
        title: 'Alerón GT Carbon Fiber Universal',
        price: 350,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80',
        category: 'Exterior',
        condition: 'Nuevo' as const,
        seller: 'CarbonW'
    }
];

const CATEGORIES = ['Performance', 'Suspensión', 'Rines', 'Frenos', 'Exterior', 'Interior', 'Servicios'];

export default function MarketplacePage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Marketplace</h1>
                <p className={styles.description}>
                    Encuentra las mejores piezas, servicios y vehículos de la comunidad Speedlight.
                </p>
            </header>

            <div className={styles.layout}>
                {/* Sidebar Filters */}
                <aside className={styles.filters}>
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Categorías</h3>
                        <ul className={styles.filterList}>
                            {CATEGORIES.map((cat) => (
                                <li key={cat} className={styles.filterItem}>
                                    <label className={styles.filterLabel}>
                                        <input type="checkbox" className={styles.checkbox} />
                                        {cat}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Condición</h3>
                        <ul className={styles.filterList}>
                            <li className={styles.filterItem}>
                                <label className={styles.filterLabel}>
                                    <input type="checkbox" className={styles.checkbox} />
                                    Nuevo
                                </label>
                            </li>
                            <li className={styles.filterItem}>
                                <label className={styles.filterLabel}>
                                    <input type="checkbox" className={styles.checkbox} />
                                    Usado
                                </label>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.filterSection}>
                        <h3 className={styles.filterTitle}>Precio</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)',
                                    color: 'white'
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--background)',
                                    color: 'white'
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className={styles.grid}>
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </main>
            </div>

            <CTABanner
                title="¿Tienes piezas para vender?"
                description="Publica tus artículos, coches o servicios y llega a miles de entusiastas."
                buttonText="Publicar Artículo"
                buttonLink="/marketplace/sell"
                backgroundImage="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80"
            />
        </div>
    );
}

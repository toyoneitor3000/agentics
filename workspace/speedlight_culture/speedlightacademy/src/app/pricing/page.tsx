"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CTABanner } from '@/components/ui/CTABanner';

export default function PricingPage() {
    const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');

    // Exchange Rate (Approximate based on TRM 3830)
    const EXCHANGE_RATE = 3830;

    const formatPrice = (copPrice: number) => {
        if (currency === 'COP') {
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(copPrice);
        }
        const usdPrice = copPrice / EXCHANGE_RATE;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(usdPrice);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(196, 242, 44, 0.1)',
                    color: 'var(--primary)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    border: '1px solid var(--primary)'
                }}>
                    🚀 Fase de Lanzamiento - Precios Especiales
                </div>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Elige tu Nivel de Velocidad</h1>
                <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Únete ahora y asegura tu tarifa de "Fundador" por los próximos 5 meses.
                </p>

                {/* Currency Toggle */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setCurrency('COP')}
                        style={{
                            background: currency === 'COP' ? 'var(--foreground)' : 'transparent',
                            color: currency === 'COP' ? 'var(--background)' : 'var(--foreground)',
                            border: '1px solid var(--foreground)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Pesos (COP)
                    </button>
                    <button
                        onClick={() => setCurrency('USD')}
                        style={{
                            background: currency === 'USD' ? 'var(--foreground)' : 'transparent',
                            color: currency === 'USD' ? 'var(--background)' : 'var(--foreground)',
                            border: '1px solid var(--foreground)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Dólares (USD)
                    </button>
                </div>
            </header>

            {/* Pricing Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Plan Gratuito */}
                <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #333' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#aaa' }}>Entusiasta</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Gratis</div>
                    <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>Para empezar en la comunidad.</p>

                    <div style={{ borderTop: '1px solid #222', margin: '0 -2rem 2rem', padding: '1rem 2rem 0' }}></div>

                    <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1, color: '#ccc' }}>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#666', marginRight: '0.5rem' }}>✓</span> Acceso al Foro (Lectura/Escritura)
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#666', marginRight: '0.5rem' }}>✓</span> Comprar en Marketplace
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#666', marginRight: '0.5rem' }}>✓</span> Votar en Concursos
                        </li>
                    </ul>
                    <Button variant="ghost" fullWidth style={{ border: '1px solid #444' }}>Crear Cuenta Gratis</Button>
                </Card>

                {/* Plan Racer Pro - Promo */}
                <Card style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderColor: 'var(--secondary)',
                    background: 'linear-gradient(180deg, rgba(0,119,190,0.1) 0%, rgba(2,11,20,1) 100%)'
                }}>
                    <div style={{
                        color: 'var(--secondary)',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        letterSpacing: '1px',
                        marginBottom: '0.5rem'
                    }}>
                        Vendedores & Talleres
                    </div>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Racer Pro</h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{formatPrice(5000)}</span>
                        <span style={{ fontSize: '1rem', color: '#888' }}>/mes</span>
                    </div>
                    <div style={{ textDecoration: 'line-through', color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Antes: {formatPrice(10000)}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(0,119,190,0.3)', margin: '0 -2rem 2rem', padding: '1rem 2rem 0' }}></div>

                    <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1, color: '#ddd' }}>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--secondary)', marginRight: '0.5rem' }}>★</span>
                            <strong>Artículos Destacados</strong> y Prioritarios
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--secondary)', marginRight: '0.5rem' }}>★</span>
                            0% Comisiones de Venta
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--secondary)', marginRight: '0.5rem' }}>★</span>
                            10% OFF en Talleres Aliados
                        </li>
                    </ul>
                    <Button variant="outline" fullWidth style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Obtener Pro</Button>
                </Card>

                {/* Plan Academy Elite - Promo */}
                <Card style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    borderColor: 'var(--primary)',
                    boxShadow: '0 0 40px rgba(196, 242, 44, 0.1)',
                    background: 'linear-gradient(180deg, rgba(196,242,44,0.05) 0%, rgba(2,11,20,1) 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'var(--primary)',
                        color: 'black',
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        borderRadius: '0 0 0 12px'
                    }}>
                        MEJOR VALOR
                    </div>

                    <div style={{
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        letterSpacing: '1px',
                        marginBottom: '0.5rem'
                    }}>
                        Profesionales
                    </div>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Academy Elite</h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{formatPrice(25000)}</span>
                        <span style={{ fontSize: '1rem', color: '#888' }}>/mes</span>
                    </div>
                    <div style={{ textDecoration: 'line-through', color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Antes: {formatPrice(49000)}
                    </div>

                    <div style={{ borderTop: '1px solid rgba(196,242,44,0.3)', margin: '0 -2rem 2rem', padding: '1rem 2rem 0' }}></div>

                    <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1, color: '#fff' }}>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✦</span>
                            <strong>Speedlight AI:</strong> Asistente Técnico y Creativo
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✦</span>
                            Acceso Ilimitado a Cursos (Netflix Style)
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✦</span>
                            Certificación Oficial Verificada
                        </li>
                        <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>✦</span>
                            Soporte Prioritario
                        </li>
                    </ul>
                    <Button variant="primary" fullWidth>Unirse a la Elite</Button>
                </Card>
            </div>

            {/* Ecosystem Bundle */}
            {/* Ecosystem Bundle */}
            <div style={{ marginTop: '5rem', position: 'relative' }}>
                <div style={{
                    padding: '3rem',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    borderRadius: '24px',
                    border: '1px solid #333',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}>
                    {/* Decorative Gradient Bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}></div>

                    {/* Background Texture/Glow */}
                    <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(196, 242, 44, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                        <div>
                            <div style={{
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontSize: '0.8rem',
                                marginBottom: '1.5rem',
                                fontWeight: 'bold'
                            }}>
                                Ecosistema Speedlight
                            </div>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', lineHeight: '1.1' }}>
                                Speedlight <span style={{ color: '#fff', borderBottom: '2px solid var(--secondary)' }}>Culture</span>
                            </h2>
                            <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '500px' }}>
                                La suscripción definitiva para quienes viven la cultura automotriz dentro y fuera de la pantalla.
                            </p>

                            <ul style={{ listStyle: 'none', color: '#ddd', marginBottom: '3rem', fontSize: '1.1rem' }}>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--primary)', marginRight: '1rem', fontSize: '1.2rem' }}>💎</span>
                                    <strong>Todo Academy Elite</strong> incluido
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--secondary)', marginRight: '1rem', fontSize: '1.2rem' }}>🎟️</span>
                                    Entradas VIP a Eventos y Meets
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', marginRight: '1rem', fontSize: '1.2rem' }}>👕</span>
                                    Merch Exclusivo (Drops Mensuales)
                                </li>
                                <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', marginRight: '1rem', fontSize: '1.2rem' }}>🛠️</span>
                                    Red Global de Beneficios y Talleres
                                </li>
                            </ul>

                            <Button size="lg" style={{
                                background: '#fff',
                                color: '#000',
                                fontWeight: '800',
                                padding: '1rem 3rem',
                                fontSize: '1.1rem'
                            }}>
                                Unirse a Culture
                            </Button>
                        </div>

                        {/* Visual Element */}
                        <div style={{ textAlign: 'center', opacity: 0.9, position: 'relative' }}>
                            {/* Placeholder for a cool graphic or just the logos */}
                            <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto' }}>
                                <Image
                                    src="/images/logo.png"
                                    alt="Speedlight Culture"
                                    fill
                                    style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(200%) drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}
                                />
                            </div>
                            <p style={{ marginTop: '2rem', color: '#666', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                                "Más que una academia, un estilo de vida."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <CTABanner
                title="¿Dudas sobre los planes?"
                description="Revisa nuestra documentación completa para entender los beneficios detallados y los términos de la fase de lanzamiento."
                buttonText="Ver Documentación"
                buttonLink="/docs"
            />
        </div>
    );
}

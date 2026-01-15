import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function DocsPage() {
    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <header style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Centro de Ayuda y Documentación</h1>
                <p style={{ color: '#888', fontSize: '1.2rem' }}>
                    Todo lo que necesitas saber sobre Speedlight Academy, concursos, reglas y la comunidad.
                </p>
            </header>

            <div style={{ marginBottom: '3rem' }}>
                <Card hoverEffect style={{ padding: '3rem', background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6))', borderLeft: '4px solid #fff' }}>
                    <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>🌍 El Ecosistema Speedlight</h2>
                    <p style={{ color: '#ccc', marginBottom: '1.5rem', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Speedlight Academy es parte de <strong>Speedlight Culture</strong>, la organización automotriz más grande de la región.
                        Tu cuenta y membresía pueden estar vinculadas para ofrecerte beneficios tanto digitales (Academy) como físicos (Eventos, Merch).
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="https://www.speedlightculture.com" target="_blank" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline' }}>
                            Visitar Speedlight Culture →
                        </Link>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Concursos */}
                <Card hoverEffect style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🏆 Reglas de Concursos</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Normativas detalladas para participar en Foto de la Semana, Mes y Año. Criterios de evaluación y premios.
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#ccc', marginBottom: '1.5rem' }}>
                        <li>Categorías y Pilares</li>
                        <li>Proceso de Votación (70/30)</li>
                        <li>Derechos de Autor</li>
                    </ul>
                    <Link href="/docs/contests" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Leer más →</Link>
                </Card>

                {/* Marketplace */}
                <Card hoverEffect style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🛒 Guía del Marketplace</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Cómo comprar y vender de forma segura. Políticas de reembolso y verificación de vendedores.
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#ccc', marginBottom: '1.5rem' }}>
                        <li>Verificación de Identidad</li>
                        <li>Comisiones y Pagos</li>
                        <li>Envíos y Logística</li>
                    </ul>
                    <Link href="/docs/marketplace" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Leer más →</Link>
                </Card>

                {/* Academia */}
                <Card hoverEffect style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🎓 Manual del Estudiante</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Acceso a cursos, certificados y recursos descargables. Guía para instructores.
                    </p>
                    <Link href="/docs/academy" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Leer más →</Link>
                </Card>

                {/* Legal */}
                <Card hoverEffect style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>⚖️ Legal y Privacidad</h2>
                    <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                        Términos de servicio, política de privacidad y uso de datos.
                    </p>
                    <Link href="/terms" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Ver Legal →</Link>
                </Card>

            </div>
        </div>
    );
}

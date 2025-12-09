import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CTABanner } from '@/components/ui/CTABanner';
import { AdAcademyIntro } from '@/components/AdBanners';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Revolucionando la<br />Cultura Automotriz
        </h1>
        <p className={styles.subtitle}>
          Speedlight Academy es el epicentro donde entusiastas, profesionales y marcas convergen.
          Compra, aprende, compite y conecta en un solo lugar.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/marketplace">
            <Button size="lg">Explorar Marketplace</Button>
          </Link>
          <Link href="/forum">
            <Button variant="outline" size="lg">Unirse al Foro</Button>
          </Link>
        </div>
      </section>

      {/* Sponsor Highlight */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', marginBottom: '4rem' }}>
        <AdAcademyIntro />
      </div>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.grid}>
          <Card hoverEffect>
            <span className={styles.cardIcon}>🛒</span>
            <h3 className={styles.cardTitle}>Marketplace</h3>
            <p className={styles.cardText}>
              Encuentra piezas únicas, servicios de taller y vehículos exclusivos. Seguridad y confianza garantizada.
            </p>
            <Link href="/marketplace">
              <Button variant="ghost" size="sm">Ver productos →</Button>
            </Link>
          </Card>

          <Card hoverEffect>
            <span className={styles.cardIcon}>🎓</span>
            <h3 className={styles.cardTitle}>Academia</h3>
            <p className={styles.cardText}>
              Domina la mecánica, el detailing y el tuning con cursos impartidos por expertos de la industria.
            </p>
            <Link href="/academy">
              <Button variant="ghost" size="sm">Ver cursos →</Button>
            </Link>
          </Card>

          <Card hoverEffect>
            <span className={styles.cardIcon}>💬</span>
            <h3 className={styles.cardTitle}>Comunidad</h3>
            <p className={styles.cardText}>
              Participa en debates técnicos, comparte tus proyectos y conecta con otros apasionados.
            </p>
            <Link href="/forum">
              <Button variant="ghost" size="sm">Ir al foro →</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Pricing CTA */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 2rem' }}>
        <CTABanner
          title="Potencia tu Carrera"
          description="Descubre los planes y membresías diseñados para llevarte al podio de la industria."
          buttonText="Ver Planes y Precios"
          buttonLink="/pricing"
          backgroundImage="https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&q=80"
        />
      </div>
    </div>
  );
}

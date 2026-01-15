import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>Speedlight<span className={styles.highlight}>Academy</span></h3>
                        <p className={styles.byline}>
                            by <a href="https://www.speedlightculture.com" target="_blank" rel="noopener noreferrer" className={styles.cultureLink}>Speedlight Culture</a>
                        </p>
                        <p className={styles.description}>
                            Elevando la cultura automotriz mediante educación, comunidad y pasión.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>Plataforma</h4>
                        <Link href="/marketplace">Marketplace</Link>
                        <Link href="/forum">Foro</Link>
                        <Link href="/academy">Academia</Link>
                        <Link href="/contests">Concursos</Link>
                        <Link href="/pricing" style={{ color: 'var(--primary)' }}>Planes y Precios</Link>
                        <Link href="/advertising">Publicidad</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Ayuda</h4>
                        <Link href="/docs">Documentación</Link>
                        <Link href="/terms">Términos y Condiciones</Link>
                        <Link href="/privacy">Privacidad</Link>
                    </div>

                    <div className={styles.column}>
                        <h4>Social</h4>
                        <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {currentYear} Speedlight Academy. </p>
                    <p className={styles.credits}>
                        Diseñado y Desarrollado por <a href="https://purrpurr.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Purrpurr.dev</a> en Bogotá, Colombia.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

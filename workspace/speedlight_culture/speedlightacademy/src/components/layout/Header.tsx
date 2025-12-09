"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { AdHeroSponsor } from '../AdBanners';
import styles from './Header.module.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Mobile Menu Toggle (Left on Mobile) */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menú"
                >
                    <span className={isMobileMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
                </button>

                {/* Left: Navigation (Desktop) */}
                <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navMobileOpen : ''}`}>
                    <Link href="/marketplace" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
                    <Link href="/forum" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Foro</Link>
                    <Link href="/academy" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Academia</Link>
                    <Link href="/contests" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Concursos</Link>
                </nav>

                {/* Center: Logo Only */}
                <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/images/logo.png"
                            alt="Speedlight Academy"
                            className={styles.logoImage}
                            width={90}
                            height={90}
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </Link>

                {/* Right: Actions */}
                <div className={styles.actions}>
                    {/* Hero Sponsor (Hidden on mobile via Tailwind) */}
                    <div className="hidden xl:block mr-4">
                        <AdHeroSponsor />
                    </div>
                    <Link href="/login">
                        <div className={styles.loginBtnWrapper}>
                            <Button size="sm" variant="outline" className={styles.loginBtn}>Acceder</Button>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;

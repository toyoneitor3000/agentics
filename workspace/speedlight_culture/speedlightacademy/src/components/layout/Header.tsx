"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { AdHeroSponsor } from '../AdBanners';
import { createClient } from '@/app/utils/supabase/client';
import styles from './Header.module.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null); // Using any temporarily to avoid type juggling
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        window.location.reload();
    };

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
                    {/* Hero Sponsor */}
                    <div className="hidden xl:block mr-4">
                        <AdHeroSponsor />
                    </div>

                    {!user ? (
                        <Link href="/login">
                            <div className={styles.loginBtnWrapper}>
                                <Button size="sm" variant="outline" className={styles.loginBtn}>Acceder</Button>
                            </div>
                        </Link>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border border-[#FF9800]/50"
                            >
                                {user.user_metadata?.avatar_url ? (
                                    <Image
                                        src={user.user_metadata.avatar_url}
                                        alt="User"
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#333] flex items-center justify-center text-white">U</div>
                                )}
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-12 w-56 bg-[#000] border border-[#333] rounded-xl shadow-xl z-50 p-2 flex flex-col gap-1">
                                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-[#333] mb-1 truncate">
                                        {user.user_metadata?.full_name || user.email}
                                    </div>

                                    {/* CROSS LINKING TO CULTURE PROFILE */}
                                    <a
                                        href="http://localhost:3000/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                                    >
                                        👤 Mi Speedlight ID
                                    </a>

                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                                    >
                                        🚪 Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

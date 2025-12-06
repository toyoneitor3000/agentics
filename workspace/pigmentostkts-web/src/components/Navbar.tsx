"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PIGMENTO_DATA } from "@/lib/pigmento-content";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Colección", href: "/catalog" },
    { name: "Packs", href: "/packs" },
    { name: "Diseño", href: "#design" },
  ];

  return (
    <div className="relative">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 ${ 
          scrolled 
            ? "py-2 bg-brand-black/80 backdrop-blur-xl shadow-lg"
            : "py-4 bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* LOGO IMAGE */}
          <Link href="/" className="relative block w-40 h-16 md:w-52 md:h-20 transition-transform hover:scale-105">
             {/* Use brightness-0 invert to make logo white in dark mode */}
            <Image 
              src="/brand/logo.png" 
              alt="PIGMENTO Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 160px, 208px"
              priority
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-wide uppercase">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="relative text-gray-300 hover:text-white transition-colors py-2 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-yellow transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link 
              href={PIGMENTO_DATA?.contact?.whatsappUrl || '#'}
              target="_blank"
              className="bg-brand-yellow text-brand-black px-6 py-2.5 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,214,0,0.4)]"
            >
              Cotizar
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-black tracking-tight">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="border-b border-white/10 pb-4 text-white hover:text-brand-yellow transition-colors"
                >
                  {link.name}
                </Link>
              ))}
               <Link 
                href={PIGMENTO_DATA?.contact?.whatsappUrl || '#'}
                className="bg-brand-yellow text-brand-black py-4 text-center rounded-xl mt-4 font-bold shadow-lg"
              >
                COTIZAR PROYECTO
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

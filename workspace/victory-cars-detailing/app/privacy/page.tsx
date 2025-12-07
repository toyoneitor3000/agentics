import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-brand-dark-blue text-brand-slate py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/" className="inline-flex items-center text-brand-cyan hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" size={20} />
                    Volver al Inicio
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8 font-orbitron">Política de Privacidad</h1>

                <div className="space-y-6 bg-brand-mid-blue/30 p-8 rounded-2xl border border-white/5">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
                        <p>
                            En Victory Cars Detailing, nos comprometemos a proteger su privacidad y a garantizar la seguridad de sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos su información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Información que Recopilamos</h2>
                        <p>
                            Podemos recopilar información personal como su nombre, número de teléfono, dirección de correo electrónico y detalles de su vehículo cuando usted:
                        </p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                            <li>Se pone en contacto con nosotros a través de nuestro sitio web o WhatsApp.</li>
                            <li>Solicita una cotización o agenda una cita.</li>
                            <li>Se suscribe a nuestro boletín informativo.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Uso de la Información</h2>
                        <p>
                            Utilizamos su información para:
                        </p>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
                            <li>Procesar sus solicitudes y agendar servicios.</li>
                            <li>Comunicarnos con usted sobre el estado de su vehículo o cita.</li>
                            <li>Enviarle información relevante sobre nuestros servicios y promociones (si ha dado su consentimiento).</li>
                            <li>Mejorar nuestros servicios y la experiencia del cliente.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Protección de Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la alteración. No compartimos su información con terceros sin su consentimiento, excepto cuando sea necesario para prestar nuestros servicios o cumplir con la ley.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Contacto</h2>
                        <p>
                            Si tiene preguntas sobre nuestra política de privacidad o desea ejercer sus derechos sobre sus datos, por favor contáctenos a través de WhatsApp o correo electrónico.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-white/10 text-sm text-brand-slate/60">
                        Última actualización: {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </div>
    );
}

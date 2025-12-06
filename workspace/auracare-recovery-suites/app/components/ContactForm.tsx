'use client';

import { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        surgery: '',
        dates: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Crear mensaje para WhatsApp
        const whatsappMessage = `
🏥 *Nueva Consulta - Beauty & Comfort*

👤 *Nombre:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Teléfono:* ${formData.phone}
💉 *Tipo de Cirugía:* ${formData.surgery}
📅 *Fechas Estimadas:* ${formData.dates}

💬 *Mensaje:*
${formData.message}
    `.trim();

        // Abrir WhatsApp con el mensaje
        const whatsappUrl = `https://wa.me/573223524103?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        // Simular envío exitoso
        setTimeout(() => {
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                surgery: '',
                dates: '',
                message: ''
            });

            setTimeout(() => setStatus('idle'), 3000);
        }, 500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="María García"
                    />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                            placeholder="maria@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                </div>

                {/* Surgery Type */}
                <div>
                    <label htmlFor="surgery" className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Cirugía *
                    </label>
                    <select
                        id="surgery"
                        name="surgery"
                        required
                        value={formData.surgery}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="Liposucción">Liposucción</option>
                        <option value="Aumento de Senos">Aumento de Senos</option>
                        <option value="Abdominoplastia">Abdominoplastia (Tummy Tuck)</option>
                        <option value="BBL">BBL (Brazilian Butt Lift)</option>
                        <option value="Rinoplastia">Rinoplastia</option>
                        <option value="Lifting Facial">Lifting Facial</option>
                        <option value="Mommy Makeover">Mommy Makeover</option>
                        <option value="Otra">Otra</option>
                    </select>
                </div>

                {/* Dates */}
                <div>
                    <label htmlFor="dates" className="block text-sm font-semibold text-gray-700 mb-2">
                        Fechas Estimadas de Estadía
                    </label>
                    <input
                        type="text"
                        id="dates"
                        name="dates"
                        value={formData.dates}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        placeholder="Ej: 15-20 de Enero, 2025"
                    />
                </div>

                {/* Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Mensaje Adicional
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                        placeholder="Cuéntanos más sobre tus necesidades..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full btn btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : status === 'success' ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            ¡Enviado! Te contactaremos pronto
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Enviar Consulta por WhatsApp
                        </span>
                    )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                    Al enviar, serás redirigido a WhatsApp para completar tu consulta de forma directa y segura.
                </p>
            </form>
        </div>
    );
}

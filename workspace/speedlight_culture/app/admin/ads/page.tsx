"use client";

import { useState } from 'react';
import { AdCampaign, AdType, activeCampaigns } from '@/app/data/ads';
import {
    AdHeroSponsor,
    AdFeedCard,
    AdSidebarSpec,
    AdWorkshopBadge,
    AdAcademyIntro
} from '@/app/components/AdBanners';
import Link from 'next/link';

export default function AdminAdsPage() {
    const [activeTab, setActiveTab] = useState<AdType>('feed_card');
    const [formData, setFormData] = useState<Partial<AdCampaign['content']>>({
        brandName: '',
        title: '',
        description: '',
        ctaText: 'Ver Más',
        ctaLink: '#',
        badgeText: 'Partner'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Mock campaign for preview
    const previewCampaign: AdCampaign = {
        id: 'preview',
        type: activeTab,
        clientName: 'Preview Client',
        isActive: true,
        content: {
            brandName: formData.brandName || 'Marca Ejemplo',
            title: formData.title || 'Título del Anuncio',
            description: formData.description || 'Descripción corta del producto o servicio que aparecerá en el anuncio.',
            ctaText: formData.ctaText || 'Botón',
            ctaLink: formData.ctaLink || '#',
            badgeText: formData.badgeText || 'Badge',
            // Mock data for specific types if needed
            rating: '9.8',
            specs: [
                { label: 'Spec 1', value: 'Valor 1' },
                { label: 'Spec 2', value: 'Valor 2' }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5E6D3] p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Speedlight Ad Manager</h1>
                        <p className="text-[#BCAAA4]">Portal de Gestión de Publicidad Nativa</p>
                    </div>
                    <Link href="/" className="px-4 py-2 border border-[#FF9800] text-[#FF9800] rounded hover:bg-[#FF9800] hover:text-black transition-colors text-sm font-bold uppercase tracking-wider">
                        Volver al Sitio
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: FORM */}
                    <div className="bg-[#0F0A08] p-8 rounded-xl border border-white/5">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[#FF9800] rounded-full"></span>
                            Crear / Probar Anuncio
                        </h2>

                        {/* Type Selector */}
                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest text-[#BCAAA4] mb-3">Tipo de Componente</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'hero_sponsor', label: 'Hero Sponsor' },
                                    { id: 'feed_card', label: 'Feed Card' },
                                    { id: 'sidebar_spec', label: 'Tech Spec' },
                                    { id: 'workshop_badge', label: 'Workshop Badge' },
                                    { id: 'academy_intro', label: 'Academy Intro' },
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveTab(type.id as AdType)}
                                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all ${activeTab === type.id
                                                ? 'bg-[#FF9800] text-black border-[#FF9800]'
                                                : 'bg-transparent text-white border-white/20 hover:border-white/50'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-[#BCAAA4] mb-1">Nombre de Marca (Brand Name)</label>
                                <input
                                    type="text"
                                    name="brandName"
                                    value={formData.brandName}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Michelin"
                                    className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                />
                            </div>

                            {(activeTab === 'feed_card' || activeTab === 'sidebar_spec') && (
                                <>
                                    <div>
                                        <label className="block text-xs text-[#BCAAA4] mb-1">Título Principal</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Oferta de Verano"
                                            className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#BCAAA4] mb-1">Descripción</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Descripción corta..."
                                            rows={3}
                                            className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[#FF9800] outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-[#BCAAA4] mb-1">Label (Badge)</label>
                                    <input
                                        type="text"
                                        name="badgeText"
                                        value={formData.badgeText}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Partner"
                                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#BCAAA4] mb-1">CTA Text</label>
                                    <input
                                        type="text"
                                        name="ctaText"
                                        value={formData.ctaText}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Ver Oferta"
                                        className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-[#FF9800] outline-none transition-colors"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-500">
                            <p>⚠️ <strong>Modo Simulación:</strong> Estos cambios son solo visuales para validar el diseño. Para publicar, copia los datos al archivo <code>app/data/ads.ts</code>.</p>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: PREVIEW */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-[#FF9800] rounded-full"></span>
                            Vista Previa en Vivo
                        </h2>

                        <div className="bg-[#1a1a1a] p-8 rounded-xl min-h-[400px] flex items-center justify-center border border-dashed border-white/20 relative overflow-hidden">
                            {/* Background Grid for context */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <div className="relative z-10 w-full max-w-md transform transition-all duration-500">
                                {activeTab === 'hero_sponsor' && <AdHeroSponsor data={previewCampaign} />}
                                {activeTab === 'feed_card' && <AdFeedCard data={previewCampaign} />}
                                {activeTab === 'sidebar_spec' && <AdSidebarSpec data={previewCampaign} />}
                                {activeTab === 'workshop_badge' && <AdWorkshopBadge data={previewCampaign} />}
                                {activeTab === 'academy_intro' && <div className="aspect-video w-full"><AdAcademyIntro data={previewCampaign} /></div>}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-white font-bold mb-4">Campañas Activas en Sistema ({activeCampaigns.length})</h3>
                            <div className="space-y-2">
                                {activeCampaigns.map(camp => (
                                    <div key={camp.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                        <div>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-black mr-3 ${camp.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {camp.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-sm font-bold text-white">{camp.clientName}</span>
                                            <span className="text-xs text-[#BCAAA4] ml-2">({camp.type})</span>
                                        </div>
                                        <span className="text-xs font-mono text-white/30">{camp.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

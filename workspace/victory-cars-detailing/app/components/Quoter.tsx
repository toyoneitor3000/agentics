'use client';

import React, { useState, useMemo } from 'react';
import { FaCar, FaTruckMonster, FaCheckCircle, FaCalculator, FaTag } from 'react-icons/fa';

const VEHICLE_TYPES = [
    { id: 'auto', label: 'Automóvil', icon: FaCar },
    { id: 'suv', label: 'SUV / Camioneta', icon: FaTruckMonster },
];

const SERVICES = [
    {
        id: 'sylex',
        name: 'Protección Cerámica SYLEX 9H',
        prices: { auto: 1090000, suv: 1290000 },
        category: 'Cerámicos'
    },
    {
        id: 'systemx',
        name: 'Crystal System X USA',
        prices: { auto: 1390000, suv: 1590000 },
        category: 'Cerámicos'
    },
    {
        id: 'gtechniq',
        name: 'GTECHNIQ Crystal Serum Light',
        prices: { auto: 1690000, suv: 1890000 },
        category: 'Cerámicos'
    },
    {
        id: 'aqua-wash',
        name: 'Lavado Premium Aqua Wash',
        prices: { auto: 125000, suv: 135000 },
        category: 'Lavado'
    },
    {
        id: 'detailing-wash',
        name: 'Lavado Detailing Completo',
        prices: { auto: 180000, suv: 210000 },
        category: 'Lavado'
    },
    {
        id: 'upholstery',
        name: 'Tapicería Full Clean',
        prices: { auto: 255000, suv: 300000 },
        category: 'Interior'
    },
    {
        id: 'pdr',
        name: 'PDR - Sacatocos (Desde)',
        prices: { auto: 80000, suv: 80000 },
        category: 'Reparación'
    },
    {
        id: 'painting',
        name: 'Pintura de Piezas (Desde)',
        prices: { auto: 220000, suv: 220000 },
        category: 'Reparación'
    },
];

interface QuoterProps {
    hasDiscount?: boolean;
    discountCode?: string;
}

const Quoter: React.FC<QuoterProps> = ({ hasDiscount = false, discountCode }) => {
    const [selectedVehicle, setSelectedVehicle] = useState<'auto' | 'suv'>('auto');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const totals = useMemo(() => {
        const subtotal = selectedServices.reduce((acc, serviceId) => {
            const service = SERVICES.find(s => s.id === serviceId);
            return acc + (service?.prices[selectedVehicle] || 0);
        }, 0);

        const discount = hasDiscount ? subtotal * 0.20 : 0;
        const total = subtotal - discount;

        return { subtotal, discount, total };
    }, [selectedVehicle, selectedServices, hasDiscount]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-brand-dark-blue/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-brand-cyan/20 rounded-xl flex items-center justify-center text-brand-cyan">
                        <FaCalculator size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white uppercase tracking-wider">
                            Cotizador <span className="text-brand-cyan">Inteligente</span>
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base">Selecciona tu tipo de vehículo y los servicios que deseas.</p>
                    </div>
                </div>

                {/* Step 1: Vehicle Type */}
                <div className="mb-10">
                    <label className="text-xs font-orbitron text-brand-cyan uppercase tracking-widest mb-4 block">1. Tipo de Vehículo</label>
                    <div className="grid grid-cols-2 gap-4">
                        {VEHICLE_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedVehicle(type.id as any)}
                                className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-300 ${selectedVehicle === type.id
                                        ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                    }`}
                            >
                                <type.icon size={32} />
                                <span className="font-orbitron font-bold text-sm tracking-tighter uppercase">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Services */}
                <div className="mb-10">
                    <label className="text-xs font-orbitron text-brand-cyan uppercase tracking-widest mb-4 block">2. Servicios Disponibles</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SERVICES.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${selectedServices.includes(service.id)
                                        ? 'bg-brand-cyan/5 border-brand-cyan/50 text-white'
                                        : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${selectedServices.includes(service.id)
                                            ? 'bg-brand-cyan border-brand-cyan text-brand-dark-blue'
                                            : 'border-white/20'
                                        }`}>
                                        {selectedServices.includes(service.id) && <FaCheckCircle size={14} />}
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium">{service.name}</span>
                                        <span className="text-[10px] uppercase text-brand-cyan/70 font-orbitron tracking-tighter">{service.category}</span>
                                    </div>
                                </div>
                                <span className="font-inter font-bold text-sm whitespace-nowrap ml-4">
                                    {formatCurrency(service.prices[selectedVehicle])}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Table */}
                <div className="mt-12 bg-black/40 rounded-2xl p-6 md:p-8 border border-white/5">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-slate-400">
                            <span>Subtotal estimado</span>
                            <span className="font-inter">{formatCurrency(totals.subtotal)}</span>
                        </div>
                        {hasDiscount && totals.discount > 0 && (
                            <div className="flex justify-between text-emerald-400 bg-emerald-400/5 p-3 rounded-lg border border-emerald-400/20">
                                <div className="flex items-center gap-2">
                                    <FaTag size={12} />
                                    <span>Bono de Descuento (20%)</span>
                                    {discountCode && <span className="text-[10px] bg-emerald-400/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider">{discountCode}</span>}
                                </div>
                                <span className="font-inter">-{formatCurrency(totals.discount)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                        <span className="text-xl font-orbitron font-bold text-white uppercase tracking-tighter">Total Inversión</span>
                        <div className="text-right">
                            <span className="text-3xl md:text-4xl font-inter font-black text-brand-cyan block">
                                {formatCurrency(totals.total)}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-orbitron">Sujeto a peritaje físico</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <a
                            href={`https://wa.me/573157742419?text=Hola!%20Acabo%20de%20hacer%20una%20cotización%20en%20el%20sitio%20web%20para%20mi%20${selectedVehicle === 'auto' ? 'Automóvil' : 'SUV'}.%0A%0AServicios%20interesados:%20${selectedServices.map(sid => SERVICES.find(s => s.id === sid)?.name).join(',%20')}%0A%0A${hasDiscount ? `Tengo%20un%20bono%20del%2020%25%20OFF!%20Código:%20${discountCode}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-brand-cyan text-brand-dark-blue font-orbitron font-bold py-4 rounded-xl text-center hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.3)] uppercase tracking-wider"
                        >
                            Reservar Cupo Ahora
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quoter;

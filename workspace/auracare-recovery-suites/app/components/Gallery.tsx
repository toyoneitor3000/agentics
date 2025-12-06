'use client';

import { useState } from 'react';

const images = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1512918760532-3edbed135196?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Habitaciones',
        title: 'Suite Principal',
        description: 'Espacio amplio con cama clínica ajustable y baño privado adaptado.'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Áreas Comunes',
        title: 'Sala de Estar',
        description: 'Ambiente relajante para compartir y descansar.'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Alimentación',
        title: 'Menú Saludable',
        description: 'Platos diseñados por nutricionistas para tu recuperación.'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1576091160550-2187d80a5873?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Servicios',
        title: 'Enfermería 24/7',
        description: 'Personal calificado pendiente de ti en todo momento.'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Habitaciones',
        title: 'Habitación Standard',
        description: 'Confort y tranquilidad con todas las comodidades.'
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Servicios',
        title: 'Drenajes Linfáticos',
        description: 'Zona especializada para tus masajes post-operatorios.'
    }
];

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);

    const categories = ['Todos', ...Array.from(new Set(images.map(img => img.category)))];

    const filteredImages = selectedCategory === 'Todos'
        ? images
        : images.filter(img => img.category === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === category
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-600 hover:bg-purple-50'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map(image => (
                    <div
                        key={image.id}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image.src}
                            alt={image.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-teal-300 text-sm font-medium mb-1">{image.category}</span>
                            <h3 className="text-white text-xl font-bold">{image.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="md:w-2/3 h-64 md:h-auto relative">
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="md:w-1/3 p-8 flex flex-col justify-center bg-white">
                            <span className="text-purple-600 font-medium mb-2">{selectedImage.category}</span>
                            <h3 className="text-2xl font-bold mb-4">{selectedImage.title}</h3>
                            <p className="text-gray-600 mb-6">{selectedImage.description}</p>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="btn btn-outline w-full justify-center"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

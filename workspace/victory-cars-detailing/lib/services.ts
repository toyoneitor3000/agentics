 
'use client';
import React from 'react';
import { Car, Search, Shield, Sparkles, SprayCan, Wind } from 'lucide-react';

export interface Service {
  slug: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  shortDescription: string;
  longDescription: string;
  heroImage: string;
  gallery: string[];
}

export const SERVICES: Service[] = [
  {
    slug: 'detailing-pro-finish',
    icon: Sparkles,
    title: 'Detailing Pro Finish',
    shortDescription: 'Corrección de pintura exhaustiva para un acabado tipo espejo.',
    longDescription: 'Nuestro servicio de Detailing Pro Finish es un proceso meticuloso de varias etapas que elimina imperfecciones como arañazos, marcas de remolino y oxidación. Utilizamos compuestos de pulido de la más alta calidad y técnicas de vanguardia para restaurar la pintura de su vehículo a un estado mejor que el de fábrica, logrando una profundidad, claridad y brillo incomparables.',
    heroImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1599423300020-f166a5c1c87a?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541443029-7b36f7344802?q=80&w=2070&auto=format&fit=crop',
    ]
  },
  {
    slug: 'recubrimiento-ceramico',
    icon: SprayCan,
    title: 'Recubrimiento Cerámico',
    shortDescription: 'Protección de larga duración para cuidar y realzar el brillo.',
    longDescription: 'Proteja su inversión con nuestros recubrimientos cerámicos de grado profesional. Esta capa líquida de polímero se adhiere a la pintura de su vehículo, creando una barrera hidrofóbica y duradera contra los contaminantes ambientales, los rayos UV y los arañazos leves. El resultado es un brillo intenso y una facilidad de limpieza asombrosa que dura años, no meses.',
    heroImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1621007826765-5e2a9a7a0b3c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606303251502-62b0857c7247?q=80&w=2070&auto=format&fit=crop'
    ]
  },
  {
    slug: 'tapiceria-full-clean',
    icon: Car,
    title: 'Tapicería Full Clean',
    shortDescription: 'Limpieza y desinfección completa del interior de su vehículo.',
    longDescription: 'Revitalice el interior de su vehículo con nuestro servicio de limpieza profunda de tapicería. Utilizamos extractores de vapor caliente y productos especializados para eliminar de forma segura la suciedad, las manchas y los alérgenos de las alfombras, los asientos y los paneles. Devolvemos la frescura, el olor a nuevo y la estética impecable al habitáculo de su coche.',
    heroImage: 'https://images.unsplash.com/photo-1551538855-b5f7e5d8713a?q=80&w=1964&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1603592496030-9a3769c8e426?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529129731115-9a3c03160a2b?q=80&w=2070&auto=format&fit=crop'
    ]
  },
  {
    slug: 'style-wrap-ppf',
    icon: Wind,
    title: 'Style Wrap & PPF',
    shortDescription: 'Personalización y defensa con vinilos estéticos y Películas de Protección.',
    longDescription: 'Transforme la apariencia de su vehículo con un Style Wrap o protéjalo de forma invisible con la Película de Protección de Pintura (PPF). Ofrecemos una amplia gama de colores y acabados para una personalización única. Nuestro PPF de alta calidad es un escudo transparente y autorreparable contra los arañazos, las astillas de roca y el desgaste diario, manteniendo su pintura original en perfecto estado.',
    heroImage: 'https://images.unsplash.com/photo-1603584946323-0498b3c103e3?q=80&w=1974&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1627572763264-16728a47476e?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592243472338-9b8843977a41?q=80&w=2070&auto=format&fit=crop'
    ]
  }
];

export const PROCESS_STEPS = [
  { icon: Search, title: 'Diagnóstico Inicial', description: 'Evaluamos el estado de su vehículo para recomendar el tratamiento perfecto.' },
  { icon: SprayCan, title: 'Preparación y Descontaminación', description: 'Limpieza profunda para asegurar que la superficie esté impecable y lista.' },
  { icon: Sparkles, title: 'Corrección y Pulido', description: 'Eliminamos imperfecciones para devolverle el máximo brillo y claridad a la pintura.' },
  { icon: Shield, title: 'Protección y Sellado', description: 'Aplicamos cerámicos o selladores para una protección y un acabado duradero.' }
];

export const TESTIMONIALS = [
  { name: 'Juan Pérez', car: 'BMW M4', quote: 'El nivel de detalle es increíble. Mi coche se ve mejor que cuando salió del concesionario. ¡Totalmente recomendados!' },
  { name: 'Ana García', car: 'Audi Q5', quote: 'El recubrimiento cerámico es mágico. La limpieza es mucho más fácil y el brillo es espectacular. Un servicio impecable!' },
  { name: 'Carlos Rojas', car: 'Mercedes-Benz Clase C', quote: 'Profesionalismo y pasión por lo que hacen. La restauración interior dejó mi coche como nuevo. Volveré sin dudarlo.' }
];

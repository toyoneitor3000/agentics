export const PIGMENTO_DATA = {
  contact: {
    whatsapp: "+57 316 0535247",
    whatsappUrl: "https://wa.me/573160535247",
    email: "designedbypigmento@gmail.com",
    catalogUrl: "https://wa.me/c/573160535247",
    hours: {
      weekdays: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM"
    }
  },
  paymentMethods: [
    { name: "Bancolombia", detail: "Ahorros 204 795227 91" },
    { name: "Nequi/Daviplata", detail: "3160535247" },
    { name: "Efecty", detail: "CC 1019089803" }
  ],
  shipping: {
    cundinamarca: { price: 7500, time: "1 día" },
    nacional: { price: 13500, time: "2-3 días" }
  },
  services: [
    {
      id: "stickers-custom",
      title: "Stickers Personalizados",
      description: "Vinilo blanco, transparente, tornasol y de corte.",
      priceStart: "$75,000/m² (Speedlight)",
      icon: "Sticker"
    },
    {
      id: "plotter",
      title: "Plotter de Corte",
      description: "Servicio profesional. Incluye vinilo + transfer + corte.",
      priceStart: "$35,000/mt",
      icon: "Scissors"
    },
    {
      id: "design",
      title: "Servicios de Diseño",
      description: "Desde vectorización básica hasta branding completo.",
      priceStart: "$75,000",
      icon: "PenTool"
    },
    {
      id: "cubreplacas",
      title: "Cubreplacas",
      description: "Personalización y protección para tu moto.",
      priceStart: "$55,000/par",
      icon: "Shield"
    }
  ],
  pricing: {
    materials: [
      { name: "Vinilo Blanco", price: 134900, speedlight: 75000, unit: "m²" },
      { name: "Transparente", price: 134900, speedlight: 75000, unit: "m²" },
      { name: "Tornasol", price: 161700, speedlight: 80850, unit: "m²" },
      { name: "Vinilo de Corte", price: 155000, speedlight: 77500, unit: "m²" }
    ],
    packs: [
      { qty: 6, price: 12000 },
      { qty: 9, price: 18000 },
      { qty: 12, price: 24000 },
      { qty: 15, price: 30000 }
    ],
    megaPacks: [
      { name: "Coleccionista", qty: 100, price: 125000 },
      { name: "Premium", qty: 300, price: 250000 },
      { name: "Legendario", qty: 500, price: 350000 }
    ]
  },
  faqs: [
    {
      q: "¿Cuál es el tamaño mínimo?",
      a: "4x4 cm para garantizar calidad."
    },
    {
      q: "¿Tiempos de entrega?",
      a: "1 día en Cundinamarca, 2-3 días a nivel nacional."
    },
    {
      q: "¿Política de devoluciones?",
      a: "48 horas para reportar defectos. Reimpresión sin costo si es error nuestro."
    }
  ]
};
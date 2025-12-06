export interface Sticker {
  id: number;
  name: string;
  price: number; // en centavos
  displayPrice: string;
  image: string;
  category: string;
  description: string;
  features: string[];
}

export const stickers: Sticker[] = [
  {
    id: 1,
    name: "Gato Cósmico X",
    price: 3500,
    displayPrice: "$35.00",
    image: "/images/stickers/cosmic-cat.png",
    category: "Animales",
    description: "Viajero interestelar en busca del estambre de la singularidad. Acabado holográfico premium.",
    features: ["Vinilo UV Waterproof", "Efecto Holográfico", "Durabilidad 5 años"]
  },
  {
    id: 2,
    name: "Dev Life Pro",
    price: 3000,
    displayPrice: "$30.00",
    image: "/images/stickers/dev-life.png",
    category: "Tech",
    description: "Código, café y pánico al deploy del viernes. El escudo honorífico de todo desarrollador full-stack.",
    features: ["Corte Die-Cut", "Mate Antireflejo", "Adhesivo 3M"]
  },
  {
    id: 3,
    name: "Café Infinito",
    price: 2500,
    displayPrice: "$25.00",
    image: "/images/stickers/coffee-loop.png",
    category: "Lifestyle",
    description: "El combustible de la creatividad. Diseño minimalista para tu setup aesthetic.",
    features: ["Resistente al calor", "Lavable", "Tinta Eco-Solvente"]
  },
  {
    id: 4,
    name: "Vaporwave Sun",
    price: 4000,
    displayPrice: "$40.00",
    image: "/images/stickers/vaporwave-sun.png",
    category: "Retro",
    description: "Atardecer digital de 1984. Degradados neón sobre rejilla cibernética.",
    features: ["Fluorescente", "Tamaño XL (10cm)", "Borde Transparente"]
  },
];

export function getStickerById(id: number): Sticker | undefined {
  return stickers.find((s) => s.id === id);
}

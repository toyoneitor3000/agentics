import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stickers = [
    {
      name: "Gato Cósmico X",
      price: 3500,
      image: "/images/stickers/cosmic-cat.png",
      category: "Animales",
      description: "Viajero interestelar en busca del estambre de la singularidad. Acabado holográfico premium.",
      features: JSON.stringify(["Vinilo UV Waterproof", "Efecto Holográfico", "Durabilidad 5 años"])
    },
    {
      name: "Dev Life Pro",
      price: 3000,
      image: "/images/stickers/dev-life.png",
      category: "Tech",
      description: "Código, café y pánico al deploy del viernes. El escudo honorífico de todo desarrollador full-stack.",
      features: JSON.stringify(["Corte Die-Cut", "Mate Antireflejo", "Adhesivo 3M"])
    },
    {
      name: "Café Infinito",
      price: 2500,
      image: "/images/stickers/coffee-loop.png",
      category: "Lifestyle",
      description: "El combustible de la creatividad. Diseño minimalista para tu setup aesthetic.",
      features: JSON.stringify(["Resistente al calor", "Lavable", "Tinta Eco-Solvente"])
    },
    {
      name: "Vaporwave Sun",
      price: 4000,
      image: "/images/stickers/vaporwave-sun.png",
      category: "Retro",
      description: "Atardecer digital de 1984. Degradados neón sobre rejilla cibernética.",
      features: JSON.stringify(["Fluorescente", "Tamaño XL (10cm)", "Borde Transparente"])
    }
  ];

  for (const sticker of stickers) {
    await prisma.product.create({
      data: sticker
    });
  }

  console.log('Seed completed: 4 stickers created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

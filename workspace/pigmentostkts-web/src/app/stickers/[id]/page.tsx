import { getStickerById, stickers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartBtn from "@/components/AddToCartBtn";
import { Check } from "lucide-react";

interface Props {
  params: { id: string };
}

// Generar rutas estáticas
export async function generateStaticParams() {
  return stickers.map((sticker) => ({
    id: sticker.id.toString(),
  }));
}

export default function StickerPage({ params }: Props) {
  const id = parseInt(params.id);
  const sticker = getStickerById(id);

  if (!sticker) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen bg-brand-white">
      <div className="mb-8">
         <Button variant="outline" size="sm" className="rounded-none border-2 border-brand-black font-bold hover:bg-brand-black hover:text-white uppercase tracking-wider" asChild>
            <Link href="/">← Volver al Catálogo</Link>
         </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Imagen del Producto */}
        <div className="bg-white p-12 border-2 border-brand-black sticky top-24 shadow-[8px_8px_0px_0px_rgba(18,18,18,1)]">
          <div className="relative aspect-square">
            <img
              src={sticker.image}
              alt={sticker.name}
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Detalles del Producto */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="inline-block px-3 py-1 bg-brand-yellow text-brand-black text-xs font-black uppercase tracking-widest border border-brand-black">
                {sticker.category}
                </span>
                <span className="inline-block px-3 py-1 bg-brand-black text-brand-white text-xs font-black uppercase tracking-widest">
                EN STOCK
                </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-brand-black mb-4 tracking-tighter leading-none uppercase">
              {sticker.name}
            </h1>
            <p className="text-4xl font-black text-brand-black/90">
              {sticker.displayPrice}
            </p>
          </div>

          <div className="prose text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-brand-gray pl-4">
            <p>{sticker.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-brand-black uppercase tracking-wide">Especificaciones Técnicas:</h3>
            <ul className="grid grid-cols-1 gap-3">
              {sticker.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-brand-black font-medium bg-gray-50 p-3 border border-gray-200">
                  <div className="bg-brand-yellow p-1 mr-3 border border-brand-black flex items-center justify-center">
                    <Check className="w-4 h-4 text-brand-black" strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 border-t-2 border-dashed border-gray-300">
            <div className="flex flex-col gap-4">
              <AddToCartBtn sticker={sticker} />
              <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                🚀 Envío gratis en compras mayores a $500
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

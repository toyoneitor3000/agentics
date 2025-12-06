import Link from "next/link";
import { PIGMENTO_DATA } from "@/lib/pigmento-content";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap, Package } from "lucide-react";

export const metadata = {
  title: "Packs Legendarios | Pigmento Stickers",
  description: "Ahorra hasta un 25% con nuestros MegaPacks de colección. Edición limitada.",
};

export default function PacksPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      {/* HEADER */}
      <div className="container mx-auto px-4 text-center mb-16">
        <span className="text-brand-yellow font-bold tracking-widest uppercase mb-4 block bg-brand-black inline-block px-4 py-1 rounded-full text-sm">
          Edición Limitada
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tighter">
          MEGAPACKS <br/> DE COLECCIÓN
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ¿Eres coleccionista real? Llévate cientos de stickers exclusivos y ahorra hasta un <span className="font-bold text-brand-black">25%</span>.
        </p>
      </div>

      {/* PACKS GRID */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* PACK COLECCIONISTA */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-300 transition-all relative flex flex-col">
            <div className="mb-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 mb-4">
                <Package size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">COLECCIONISTA</h3>
              <p className="text-gray-500 font-medium">Para empezar tu imperio.</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-black tracking-tight">$125k</span>
              <span className="text-gray-400 font-medium"> / cop</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-700 font-bold">
                <Check className="text-green-500" /> 100 Stickers Únicos
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Check className="text-gray-300" /> Selección Aleatoria
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Check className="text-gray-300" /> Calidad Standard
              </li>
            </ul>
            <a href={`${PIGMENTO_DATA.contact.whatsappUrl}?text=Hola, quiero el Pack Coleccionista de 100 stickers.`} target="_blank">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 font-bold rounded-xl">
                LO QUIERO
              </Button>
            </a>
          </div>

          {/* PACK PREMIUM (DESTACADO) */}
          <div className="bg-brand-yellow rounded-3xl p-8 border-4 border-brand-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transform md:-translate-y-4 flex flex-col">
            <div className="absolute top-0 right-0 bg-brand-black text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Más Vendido
            </div>
            <div className="mb-6">
              <div className="w-14 h-14 bg-brand-black rounded-2xl flex items-center justify-center text-brand-yellow mb-4">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black text-brand-black">PREMIUM</h3>
              <p className="text-brand-black/80 font-bold">El equilibrio perfecto.</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-black tracking-tight text-brand-black">$250k</span>
              <span className="text-brand-black/60 font-bold"> / cop</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-brand-black font-bold">
                <div className="bg-brand-black text-brand-yellow p-1 rounded-full"><Check size={12} /></div> 300 Stickers Únicos
              </li>
              <li className="flex items-center gap-3 text-brand-black font-bold">
                <div className="bg-brand-black text-brand-yellow p-1 rounded-full"><Check size={12} /></div> Ahorro brutal
              </li>
              <li className="flex items-center gap-3 text-brand-black font-bold">
                <div className="bg-brand-black text-brand-yellow p-1 rounded-full"><Check size={12} /></div> Diseños Exclusivos
              </li>
            </ul>
            <a href={`${PIGMENTO_DATA.contact.whatsappUrl}?text=Hola, quiero el Pack PREMIUM de 300 stickers.`} target="_blank">
              <Button className="w-full bg-brand-black hover:bg-gray-900 text-white h-14 font-bold text-lg rounded-xl">
                COMPRAR AHORA
              </Button>
            </a>
          </div>

          {/* PACK LEGENDARIO */}
          <div className="bg-brand-black text-white rounded-3xl p-8 border-2 border-gray-800 relative flex flex-col">
             <div className="mb-6">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-brand-yellow mb-4">
                <Crown size={28} />
              </div>
              <h3 className="text-2xl font-black text-white">LEGENDARIO</h3>
              <p className="text-gray-400 font-medium">Solo para los verdaderos.</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-black tracking-tight text-brand-yellow">$350k</span>
              <span className="text-gray-500 font-medium"> / cop</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-white font-bold">
                <Check className="text-brand-yellow" /> 500 Stickers (Caja Completa)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="text-brand-yellow" /> Precio por unidad más bajo
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Check className="text-brand-yellow" /> Acceso a Colecciones Raras
              </li>
            </ul>
            <a href={`${PIGMENTO_DATA.contact.whatsappUrl}?text=Hola, quiero el Pack LEGENDARIO de 500 stickers.`} target="_blank">
              <Button variant="outline" className="w-full border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-brand-black h-12 font-bold rounded-xl">
                RECLAMAR CORONA
              </Button>
            </a>
          </div>

        </div>

        {/* MINI PACKS SECTION */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-10 text-brand-black">¿Buscas algo más pequeño? Packs de Inicio</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PIGMENTO_DATA.pricing.packs.map((pack) => (
              <div key={pack.qty} className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:border-brand-yellow transition-colors">
                <div className="text-3xl font-black text-brand-black mb-1">{pack.qty}</div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Stickers</div>
                <div className="text-lg font-bold text-brand-yellow bg-brand-black rounded-lg py-1">${pack.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
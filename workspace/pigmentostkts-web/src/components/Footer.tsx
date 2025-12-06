import Link from "next/link";
import { PIGMENTO_DATA } from "@/lib/pigmento-content";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* BRAND COL */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter">
              PIGMENTO<span className="text-brand-yellow">.</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Soluciones visuales únicas para empresas, coleccionistas y creativos. Calidad premium garantizada.
            </p>
            <div className="flex gap-4">
              <a href={PIGMENTO_DATA.contact.whatsappUrl} target="_blank" className="bg-brand-yellow text-black p-2 rounded-full hover:bg-white transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href={`mailto:${PIGMENTO_DATA.contact.email}`} className="bg-gray-800 text-white p-2 rounded-full hover:bg-brand-yellow hover:text-black transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* SERVICES COL */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-brand-yellow">SERVICIOS</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {PIGMENTO_DATA.services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="hover:text-white transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* INFO COL */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-brand-yellow">INFO</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Política de Envíos</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Devoluciones</Link></li>
              <li><a href={PIGMENTO_DATA.contact.catalogUrl} target="_blank" className="hover:text-white transition-colors">Catálogo WhatsApp</a></li>
            </ul>
          </div>

          {/* CONTACT COL */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-brand-yellow">CONTACTO</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>{PIGMENTO_DATA.contact.whatsapp}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-yellow shrink-0" />
                <span className="break-all">{PIGMENTO_DATA.contact.email}</span>
              </li>
              <li className="pt-4 border-t border-gray-800 mt-4">
                <span className="block text-brand-yellow text-xs uppercase tracking-widest mb-1">Horario</span>
                L-V: {PIGMENTO_DATA.contact.hours.weekdays}<br/>
                Sáb: {PIGMENTO_DATA.contact.hours.saturday}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pigmento Stickers. Todos los derechos reservados.</p>
          <div className="flex gap-6">
             <span>Cundinamarca, Colombia 🇨🇴</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
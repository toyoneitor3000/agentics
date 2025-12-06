import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesSection: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-brand-petroleum via-brand-black to-brand-dark-blue" id="services">
      {/* Fondo con degradados solicitados */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-light-blue/20 to-brand-dark-blue/60 opacity-40 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-light-blue/10 via-brand-black/30 to-brand-dark-blue opacity-30 -z-10"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-light-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-petroleum/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 reveal">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-orbitron tracking-wider">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-light-blue to-blue-400">
              Servicios Premium 2025
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-slate max-w-3xl mx-auto mb-8 leading-relaxed">
            Tecnología de vanguardia y atención al detalle que transforma tu vehículo
          </p>
          <div className="h-1.5 w-32 bg-gradient-to-r from-brand-cyan to-brand-light-blue mx-auto rounded-full shadow-[0_0_20px_rgba(76,201,240,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal">
          {/* PROTECCIÓN CERÁMICA - SYLEX 9H */}
          <ServiceCard
            title="Protección Cerámica SYLEX 9H"
            imageUrl="/services/silex.png"
            promotion="3 AÑOS GARANTÍA"
            benefits={[
              "Cerámico en todos los vidrios incluido",
              "Corrección de pintura profesional 95%",
              "Primer lavado de mantenimiento GRATIS",
              "Lavado completo de tapicería GRATIS",
              "Lavado detallado de motor GRATIS"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;090.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">SUV</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;290.000</span>
                </div>
              </div>
            }
          />

          {/* CRYSTAL SYSTEM X */}
          <ServiceCard
            title="Crystal System X USA"
            imageUrl="/services/systemx.png"
            promotion="5 AÑOS GARANTÍA"
            benefits={[
              "Tecnología americana de élite",
              "Cerámico en todos los vidrios",
              "Corrección de pintura 95%",
              "Lavado de tapicería GRATIS",
              "Mantenimiento inicial GRATIS"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;390.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">SUV</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;590.000</span>
                </div>
              </div>
            }
          />

          {/* GTECHNIQ PREMIUM */}
          <ServiceCard
            title="GTECHNIQ Crystal Serum Light"
            imageUrl="/services/csl.png"
            promotion="5 AÑOS PREMIUM UK"
            benefits={[
              "Tecnología británica de élite mundial",
              "Máxima dureza y brillo 9H+",
              "Corrección de pintura profesional",
              "Cerámico en vidrios incluido",
              "Paquete completo VIP"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;690.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">SUV</span>
                  <span className="text-xl font-bold text-brand-cyan">$1&#39;890.000</span>
                </div>
              </div>
            }
          />

          {/* LAVADO PREMIUM AQUA WASH */}
          <ServiceCard
            title="Lavado Premium Aqua Wash"
            imageUrl="/services/aqua-wash.jpg"
            benefits={[
              "Exterior completo profesional",
              "Limpieza interior detallada",
              "Hidratación de neumáticos",
              "Secado sin contacto (Aire)"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$125.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$135.000</span>
                </div>
              </div>
            }
          />

          {/* LAVADO NORMAL */}
          <ServiceCard
            title="Lavado Normal"
            imageUrl="/services/basic-wash.jpg"
            benefits={[
              "Lavado exterior completo",
              "Shampoo pH neutro",
              "Secado profesional",
              "Servicio rápido y eficiente"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$35.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$45.000</span>
                </div>
              </div>
            }
          />

          {/* LAVADO LLANTA A LLANTA */}
          <ServiceCard
            title="Lavado Llanta a Llanta"
            imageUrl="/services/wheel-wash.jpg"
            benefits={[
              "Exterior completo profesional",
              "Limpieza profunda de rines",
              "Pasos de rueda incluidos",
              "Hidratación de neumáticos"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$45.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$55.000</span>
                </div>
              </div>
            }
          />

          {/* LAVADO DETAILING COMPLETO */}
          <ServiceCard
            title="Lavado Detailing Completo"
            imageUrl="/services/detailing-pro-finish.jpg"
            benefits={[
              "Externo + Interno profesional",
              "Restauración de plásticos",
              "Limpieza profunda de rines",
              "Acabado espejo premium"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$180.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$210.000</span>
                </div>
              </div>
            }
          />

          {/* TAPICERÍA FULL CLEAN */}
          <ServiceCard
            title="Tapicería Full Clean"
            imageUrl="/services/upholstery.jpg"
            benefits={[
              "Inyección-succión profunda",
              "Vapor a 140°C en ductos",
              "Hidratación de cuero premium",
              "Eliminación total de olores",
              "Desinfección completa"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$255.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$300.000</span>
                </div>
              </div>
            }
          />

          {/* POLARIZADO SUN GUARD */}
          <ServiceCard
            title="Polarizado SUN GUARD Premium"
            imageUrl="/services/sun-guard.jpg"
            benefits={[
              "Rechazo de calor IR hasta 90%",
              "Protección UV 99.9%",
              "Visibilidad nocturna HD",
              "Tonos permitidos por ley",
              "Garantía de instalación"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">Desde $750k</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$850k - $1.2M</span>
                </div>
              </div>
            }
          />

          {/* PPF PROTECTION */}
          <ServiceCard
            title="PPF Protection Shield"
            imageUrl="/services/ppf.jpg"
            promotion="10 AÑOS GARANTÍA"
            benefits={[
              "Poliuretano termoplástico premium",
              "Autorregeneración con calor",
              "Invisible a simple vista",
              "Protección contra rayones",
              "Resistencia a químicos"
            ]}
            description={
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-brand-cyan font-bold text-center text-lg">
                  💎 Cotización Personalizada
                </p>
                <p className="text-xs text-brand-slate text-center mt-2">
                  Según vehículo y cobertura deseada
                  Según pieza, color y tipo de daño
                </p>
              </div>
            }
          />

          {/* BRILLADO DE VIDRIOS */}
          <ServiceCard
            title="Brillado de Vidrios Crystal Shine"
            imageUrl="/services/ceramic-coating.jpg"
            benefits={[
              "Pulido profesional de vidrios",
              "Cerámico hidrofóbico aplicado",
              "Visibilidad mejorada 300%",
              "Repelente de agua extremo",
              "Efecto lluvia invisible"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Parabrisas</span>
                  <span className="text-xl font-bold text-brand-cyan">$300.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Laterales</span>
                  <span className="text-xl font-bold text-brand-cyan">$120k c/u</span>
                </div>
              </div>
            }
          />

          {/* PERSONALIZACIÓN STYLE WRAP */}
          <ServiceCard
            title="Personalización Style Wrap"
            imageUrl="/services/style-wrap.jpg"
            promotion="NUEVO 2025"
            benefits={[
              "Envinilado total (Full Wrap)",
              "Forrado de calipers premium",
              "Wrap de detalles y piezas",
              "Personalización gráfica custom",
              "Vinilo premium importado"
            ]}
            description={
              <div className="border-t border-white/10 pt-4 mt-4">
                <span className="text-sm text-brand-slate block mb-2">Desde</span>
                <span className="text-2xl font-bold text-brand-cyan block">$250k - $6.5M</span>
                <p className="text-xs text-brand-slate mt-2">Según tipo de personalización</p>
              </div>
            }
          />

          {/* DETALLADO DE MOTOR */}
          <ServiceCard
            title="Detallado de Motor"
            imageUrl="/services/enginewash.jpeg"
            benefits={[
              "Desengrase profesional profundo",
              "Limpieza de componentes",
              "Protección de plásticos",
              "Acabado de exhibición"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Básico</span>
                  <span className="text-xl font-bold text-brand-cyan">$50.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Premium</span>
                  <span className="text-xl font-bold text-brand-cyan">$90.000</span>
                </div>
              </div>
            }
          />

          {/* MANTENIMIENTO CERÁMICO */}
          <ServiceCard
            title="Mantenimiento Cerámico"
            imageUrl="/services/ceramic-coating.jpg"
            benefits={[
              "Shampoo con SiO₂ premium",
              "Refuerzo de brillo intenso",
              "Restauración de hidrofobia",
              "Topper cerámico incluido"
            ]}
            description={
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                <div>
                  <span className="text-xs text-brand-slate block">Automóvil</span>
                  <span className="text-xl font-bold text-brand-cyan">$200.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-slate block">Camioneta</span>
                  <span className="text-xl font-bold text-brand-cyan">$250.000</span>
                </div>
              </div>
            }
          />
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-brand-slate text-lg mb-6">
            ¿No encuentras lo que buscas? Contáctanos para servicios personalizados
          </p>
          <a
            href="https://wa.me/573124730909?text=Hola,%20necesito%20información%20sobre%20servicios%20personalizados."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-blue-500 text-brand-dark-blue font-bold py-4 px-8 rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 font-orbitron tracking-wide"
          >
            <span>Consultar Servicio Personalizado</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

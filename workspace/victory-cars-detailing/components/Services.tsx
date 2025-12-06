const services = [
  { name: 'Detailing Pro Finish', description: 'Corrección de pintura para un acabado tipo espejo.' },
  { name: 'Tapicería Full Clean', description: 'Limpieza y desinfección completa de tapicería.' },
  { name: 'Style Wrap', description: 'Personalización estética con vinilos de alta calidad.' },
  { name: 'Películas Protectoras (PPF)', description: 'Protege la pintura de rayones e impactos.' },
  { name: 'Recubrimiento Cerámico', description: 'Brillo intenso y protección de larga duración.' },
  { name: 'Lámina y Pintura', description: 'Reparaciones profesionales para una carrocería impecable.' }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Servicios de <span className="text-brand-blue">Alta Gama</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-brand-dark p-8 rounded-lg border border-gray-700 hover:border-brand-blue transition duration-300">
              <h3 className="text-2xl font-bold mb-3 text-brand-blue">{service.name}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;
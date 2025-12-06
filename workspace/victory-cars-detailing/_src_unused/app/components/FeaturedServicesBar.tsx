import React from 'react';
import { FaCar, FaSprayCan, FaShieldAlt, FaStar } from 'react-icons/fa';

const FeaturedServicesBar = () => {
  const services = [
    { icon: <FaCar className="text-2xl" />, title: 'Detailing Completo', description: 'Limpieza profunda interior y exterior' },
    { icon: <FaSprayCan className="text-2xl" />, title: 'Pulido & Encerado', description: 'Brillo profesional duradero' },
    { icon: <FaShieldAlt className="text-2xl" />, title: 'Protección Cerámica', description: 'Máxima protección para tu auto' },
    { icon: <FaStar className="text-2xl" />, title: 'Restauración', description: 'Devolvemos el brillo original' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Nuestros Servicios Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white text-center">
                {service.title}
              </h3>
              <p className="text-gray-300 text-center text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServicesBar;

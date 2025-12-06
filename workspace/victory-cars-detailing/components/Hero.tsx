const Hero = () => {
  return (
    <section 
      className="h-screen bg-cover bg-center flex items-center justify-center" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2070&auto=format&fit=crop)' }}>
      <div className="text-center bg-black bg-opacity-60 p-10 rounded-lg">
        <h1 className="text-5xl font-extrabold mb-4">VICTORY CARS DETAILING</h1>
        <p className="text-xl mb-8">El Aliado Profesional que Lleva su Vehículo a su Máxima Expresión de Belleza y Detalle.</p>
        <a href="#services" className="bg-brand-blue text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 transition duration-300 text-lg">Nuestros Servicios</a>
      </div>
    </section>
  );
};
export default Hero;
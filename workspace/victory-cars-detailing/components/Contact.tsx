const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Contáctanos y <span className="text-brand-blue">Visítanos</span></h2>
        <p className="text-lg mb-4">Estamos listos para atenderte.</p>
        <p className="text-xl font-bold text-brand-blue">Cl 128 # 47-36 Bogotá</p>
        <div className="mt-8">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.417061793744!2d-74.0561!3d4.697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9ad5f8a846c5%3A0x6b723523f371804a!2sCl.%20128%20%23%2047-36%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1689280800000!5m2!1ses!2sco" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>
  );
};
export default Contact;
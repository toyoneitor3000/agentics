const Header = () => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">VC <span className="text-brand-blue">Detailing</span></div>
        <a href="#contact" className="bg-brand-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Contacto</a>
      </nav>
    </header>
  );
};
export default Header;
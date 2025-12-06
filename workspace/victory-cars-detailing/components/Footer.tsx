const Footer = () => {
  return (
    <footer className="bg-black py-6">
      <div className="container mx-auto px-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Victory Cars Detailing. Todos los derechos reservados.</p>
        <p>Desarrollado con ❤️</p>
      </div>
    </footer>
  );
}
export default Footer;

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <h2 className="text-9xl font-black text-gray-200">404</h2>
      <p className="text-2xl font-bold text-brand-black mb-8">Página no encontrada</p>
      <Link
        href="/"
        className="bg-brand-black text-white px-6 py-3 font-bold hover:bg-brand-yellow hover:text-black transition-colors"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
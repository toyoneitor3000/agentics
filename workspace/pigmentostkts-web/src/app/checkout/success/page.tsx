import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">¡Gracias por tu compra!</h1>
        <p className="text-slate-600 mb-8">
          Tu pedido #ORDER-{Math.floor(Math.random() * 10000)} ha sido confirmado. Te enviaremos un correo con los detalles del envío.
        </p>
        <Button size="lg" asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          <Link href="/">Volver a la tienda</Link>
        </Button>
      </div>
    </main>
  );
}

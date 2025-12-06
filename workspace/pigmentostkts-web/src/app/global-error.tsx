"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-black text-white">
          <h2 className="text-4xl font-black text-brand-yellow mb-4">¡Ups! Algo salió mal</h2>
          <p className="mb-8 text-gray-400">Ha ocurrido un error crítico en la aplicación.</p>
          <button
            className="bg-brand-yellow text-brand-black px-6 py-3 font-bold rounded-none hover:bg-white transition-colors"
            onClick={() => reset()}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
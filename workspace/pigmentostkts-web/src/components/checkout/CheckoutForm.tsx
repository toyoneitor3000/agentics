"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Lock } from "lucide-react";

export default function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { totalPrice } = useCart();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecretParams = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecretParams) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecretParams).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("¡Pago exitoso!");
          break;
        case "processing":
          setMessage("Tu pago se está procesando.");
          break;
        case "requires_payment_method":
          setMessage("El pago no fue exitoso, intenta de nuevo.");
          break;
        default:
          setMessage("Algo salió mal.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Ocurrió un error inesperado");
    } else {
      setMessage("Ocurrió un error inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="p-6 border-2 border-gray-100 bg-gray-50">
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>
      
      {message && <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-bold text-sm">{message}</div>}
      
      <Button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="w-full h-16 text-xl bg-brand-yellow hover:bg-brand-black hover:text-brand-yellow text-brand-black font-black uppercase tracking-widest rounded-none transition-all border-2 border-transparent hover:border-brand-yellow"
      >
        <span id="button-text" className="flex items-center gap-2">
          {isLoading ? "Procesando..." : (
            <>
              <Lock className="w-5 h-5" />
              Pagar ${(totalPrice / 100).toFixed(2)}
            </>
          )}
        </span>
      </Button>
    </form>
  );
}

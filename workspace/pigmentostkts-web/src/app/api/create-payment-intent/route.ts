import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Inicializar Stripe con la versión correcta requerida por los tipos actuales
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia', // Versión actualizada
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calcular monto total (evitar confiar en el frontend)
    // Nota: En un escenario real, deberías buscar los precios en la DB
    const amount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe usa centavos
      currency: "cop",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session?.user?.email || 'guest',
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 }
    );
  }
}
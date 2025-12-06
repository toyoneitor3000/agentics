import { loadStripe } from '@stripe/stripe-js';

// Asegúrate de agregar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en tu archivo .env.local
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY! || 'pk_test_placeholder');

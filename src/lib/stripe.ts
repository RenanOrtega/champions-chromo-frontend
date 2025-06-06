import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is not defined');
}

const stripePromise = loadStripe(publishableKey);

export default stripePromise;
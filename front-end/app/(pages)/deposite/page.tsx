"use client";

import CheckoutForm from "@/components/deposite/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY?.toString() || "",
);
const Page = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Stripe Payment</h1>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default Page;

"use client";
import { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowRight, Banknote, IndianRupee, MonitorCheck } from "lucide-react";

import { loadRazorpay } from "@/lib/razorPayLoader";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

const CheckoutForm = () => {
  const userId = "1";
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<any>(0.0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { data } = await axiosInstance.post(`/api/payment/create-intent`, {
      amount,
      currency: "INR",
    });
    console.log("INTENT : ", data);
    if (!data.data) {
      toast.error(data.message || "Something went wrong!", {
        position: "top-center",
        duration: 2500,
      });
      setLoading(false);
      return;
    }
    setClientSecret(data?.data?.client_secrete);

    if (loading) return;

    if (data?.data?.provider == "razorpay") {
      await loadRazorpay();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: 1000, // must match server-side value
        currency: "INR",
        name: "Your Company",
        description: "Test Transaction",
        order_id: data?.data?.orderId,
        handler: async function (response: any) {
          await axiosInstance.post(`/api/payment/record`, {
            amount,
            method: "razorpay",
            status: "completed",
          });
          setLoading(false);
        },
        prefill: {
          name: "Jenny Rosen",
          email: "jenny@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment Failed");
        console.log("Failed:", response);

        setLoading(false);
      });
      rzp.open();
    }
    if (!stripe || !elements) return;
    if (data.data.provider == "stripe") {
      try {
        const result = await stripe.confirmCardPayment(
          clientSecret! || data.data.client_secrete || "",
          {
            payment_method: {
              card: elements.getElement(CardElement)!,
              metadata: { userId },
            },
          },
        );
        if (result.error) {
          toast.error(`Payment failed: ${result.error.message}`);
        } else {
          if (result.paymentIntent?.status === "succeeded") {
            toast.success("Payment succeeded!");
            const { data } = await axiosInstance.post(`/api/payment/record`, {
              amount,
              method: "stripe",
              status: "completed",
            });
            console.log(data);
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
        router.push('/')
      }
    }
  };
  const feeRate = 0.015;
  const fee =
    typeof amount === "number" ? (amount * feeRate).toFixed(2) : "0.00";
  const total =
    typeof amount === "number" ? (amount + parseFloat(fee)).toFixed(2) : "0.00";
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <MonitorCheck className="text-green-400 text-3xl" />
          <h1 className="text-2xl font-bold tracking-wide">Deposit Funds</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Enter Amount (INR)
            </label>
            <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
              <IndianRupee className="text-gray-400 mr-2" />
              <input
                type="number"
                id="amount"
                min="10"
                step="1"
                placeholder="Eg. 1000"
                value={amount}
                onChange={(e: any) =>
                  setAmount(
                    e.target.value === "" ? "" : parseInt(e.target.value),
                  )
                }
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Card Element */}
          <div>
            <label htmlFor="card" className="block text-sm font-medium mb-1">
              Card Details
            </label>
            <div className="border border-gray-600 rounded-lg p-3 bg-white text-black">
              <CardElement id="card" />
            </div>
          </div>

          {/* Fee Info */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>Transaction Fee (1.5%): ₹{fee}</p>
            <p>Total to Pay: ₹{total}</p>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              loading
                ? "bg-green-800 cursor-not-allowed opacity-70"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Deposit"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Stripe Notice */}
        <div className="mt-6 text-sm text-gray-400 flex items-center gap-2 justify-center">
          <Banknote className="text-blue-400 text-xl" />
          Secured payment powered by Stripe
        </div>

        {/* Optional Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-400 break-words">
            {JSON.stringify(message)}
          </p>
        )}
      </div>
    </div>
  );
};
export default CheckoutForm;

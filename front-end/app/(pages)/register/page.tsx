"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { data: response } = await axiosInstance.post(
        "/api/user/auth/register",
        data,
      );
      if (response.success) {
        router.push(`/signin`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
  <div className="w-full max-w-md p-8 sm:p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 space-y-6">
    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
      Create Your Account
    </h2>
    <p className="text-sm text-center text-gray-500 dark:text-gray-400">
      Join the most secure trading platform today
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Username
        </label>
        <input
          {...register("username", { required: "Username is required" })}
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Choose a username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">
            {errors.username.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password.message as string}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition duration-200"
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}
        <span>{loading ? "Creating account..." : "Sign Up"}</span>
      </button>
    </form>

    <div className="text-center">
      <Link
        href="/signin"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Already have an account? Sign In
      </Link>
    </div>

    <div className="text-center mt-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 flex justify-center items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 11c0-1.105.895-2 2-2s2 .895 2 2v2a2 2 0 01-2 2h-2m0 0H9m3 0v3m6-6v-2a2 2 0 00-2-2h-2m0 0V7m0 4v3"
          />
        </svg>
        We value your privacy. Data is encrypted end-to-end.
      </p>
    </div>
  </div>
</div>

  );
}

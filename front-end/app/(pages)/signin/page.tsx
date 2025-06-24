"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { Loader } from "lucide-react";
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { data: response } = await axiosInstance.post(
        "/api/user/auth/login",
        data,
      );
      localStorage.setItem("token", response?.data?.token);
      router.push(`/`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          <img
            src="/exchange-logo.png"
            alt="Exchange Logo"
            className="h-14"
            loading="lazy"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back, Trader
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Secure login to access your portfolio and manage your assets
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg font-semibold text-sm transition duration-200"
          >
            {loading && <Loader className="animate-spin h-4 w-4" />}
            <span>{loading ? "Logging in..." : "Login"}</span>
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
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
            Your information is encrypted and secure
          </p>
        </div>
      </div>
    </div>

  );
}

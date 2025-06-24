'use client';
import { axiosInstance } from "@/lib/axiosInstance";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import dayjs from 'dayjs'
import { useQuery } from "@tanstack/react-query";

const Page=()=>{
    const [orders,setOrders]=useState([])
    const fetchUserDetails = async () => {
        try {
            const {data} = await axiosInstance.get("/api/user");
            return data?.data
        } catch (err) {
            toast.error("Failed to fetch assets");
        }
    };
    fetchUserDetails()
    const fetchTrades = async () => {
    const { data } = await axiosInstance.get("/api/database/order/closed");
    setOrders(data?.data?.orders)
    return data;
  };
  const { data:user } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUserDetails,
        staleTime:5*1000*60
    });
    const { data:order, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: fetchTrades,
        staleTime:5*1000*60
    });
    console.log(order);
    
    return (
        <div className="min-h-screen px-4 py-10">
        <div className="w-full max-w-6xl mx-auto rounded-2xl shadow-lg p-4 sm:p-6 md:p-10 space-y-10">
            {/* Header */}
            <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Account Summary
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Welcome back, <span className="font-semibold text-gray-800 dark:text-white">{user?.username}</span>. Here's a summary of your account.
            </p>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-300">Username</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">{user?.username}</p>
            </div>
            <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-300">Email</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1">{user?.email}</p>
            </div>
            <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-300">Role</p>
                <p className="text-base font-medium text-gray-900 dark:text-white mt-1 capitalize">{user?.role}</p>
            </div>
            <div className="rounded-lg p-4 border border-green-300 dark:border-green-700">
                <p className="text-xs text-green-600 dark:text-green-300">Current Balance</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">₹{user?.balance.toLocaleString()}</p>
            </div>
            </div>

            {/* Deposit History Table */}
            <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Deposit History
            </h2>
            <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm">
                <thead className="text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 text-left">
                    <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {user?.depositHistory?.map((deposit:any, index:number) => (
                    <tr
                        key={deposit._id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{index + 1}</td>
                        <td className="px-4 py-2 font-medium text-green-600 dark:text-green-400">₹{deposit.amount}</td>
                        <td className="px-4 py-2 capitalize text-gray-700 dark:text-gray-300">{deposit.method}</td>
                        <td className="px-4 py-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
                            {deposit.status}
                        </span>
                        </td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                        {dayjs(deposit.createdAt).format('DD MMM YYYY, hh:mm A')}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {/* Closed Orders */}
            <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Closed Orders
            </h2>
            <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm">
                <thead className="text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 text-left">
                    <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Side</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">P&L</th>
                    <th className="px-4 py-3">Closed At</th>
                    </tr>
                </thead>
                <tbody>
                    {orders
                    ?.filter((order:any) => order?.status === "closed")
                    ?.map((order:any, index) => (
                        <tr
                        key={order?._id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{index + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{order?.asset}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 break-all">{order?.orderId}</td>
                        <td className="px-4 py-2 capitalize text-blue-600 dark:text-blue-400">{order?.side}</td>
                        <td className="px-4 py-2 capitalize text-gray-700 dark:text-gray-300">{order?.type}</td>
                        <td className="px-4 py-2">{order?.quantity}</td>
                        <td className="px-4 py-2">₹{Number(order?.price).toLocaleString()}</td>
                        <td
                            className={`px-4 py-2 font-semibold ${
                            order?.pl >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            ₹{order?.pl.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                            {dayjs(order?.updatedAt).format("DD MMM YYYY, hh:mm A")}
                        </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
            </div>
        </div>
        </div>
    )
}
export default Page
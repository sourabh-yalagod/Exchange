import axios from "axios";
export const axiosInstace = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Authorization: "", "Content-Type": "application/json" },
});

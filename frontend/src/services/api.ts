import axios, { AxiosInstance } from "axios";
import { BACKEND_URL } from "@env";

console.log("BACKEND_URL:", BACKEND_URL);

const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL, // Usa a variável importada
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

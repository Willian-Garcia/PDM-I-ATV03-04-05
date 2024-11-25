import { BACKEND_URL } from "@env";
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Base URL em uso:", BACKEND_URL);


export default api;

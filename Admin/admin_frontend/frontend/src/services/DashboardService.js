// src/services/DashboardService.js
import axios from "axios";

// Create axios instances for pets and products
const petsApi = axios.create({
  // baseURL: "https://localhost:44337/api/pet",
  baseURL: "https://cutiepets-backend.up.railway.app/api/pet",
  withCredentials: true,
});

const productsApi = axios.create({
  baseURL: "https://cutiepets-backend.up.railway.app/api/product",
  withCredentials: true,
});

// Attach JWT token from localStorage
[petsApi, productsApi].forEach((api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
});

// Get Pets Count
export const getPetsCount = async () => {
  const res = await petsApi.get("/");
  return res.data.length || 0;
};

// Get Products Count
export const getProductsCount = async () => {
  const res = await productsApi.get("/");
  return res.data.length || 0;
};

import axios from "axios";

const API_BASE_URL = "https://localhost:44337/api/pet";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allow cookies if needed
});

// Attach JWT token from localStorage to every request
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

// Get all pets
export const getAllPets = async () => {
  const response = await api.get("/");
  console.log(response.data); // Debugging
  return response.data;
};

// Get pet by ID
export const getPetById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create pet (multipart/form-data for image upload)
export const createPet = async (formData) => {
  const response = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update pet
export const updatePet = async (id, formData) => {
  const response = await api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete pet
export async function deletePet(id) {
  const res = await api.delete(`/${id}`);
  return res.status === 204 ? null : res.data;
}

// Delete pet image
export async function deletePetImage(petId, imageId) {
  const res = await api.delete(`/${petId}/images/${imageId}`);
  return res.data;
}

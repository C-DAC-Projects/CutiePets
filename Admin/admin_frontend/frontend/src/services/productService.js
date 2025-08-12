// src/services/ProductService.js
import axios from "axios";

const API_BASE = "https://localhost:44337/api/product";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  // timeout: 10000,
});

export const getAllProducts = async () => {
  try {
    const res = await api.get("/");
    return res.data ?? [];
  } catch (err) {
    console.error("getAllProducts error:", err);
    throw err;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/${id}`);
    return res.data ?? null;
  } catch (err) {
    console.error("getProductById error:", err);
    throw err;
  }
};

export const createProduct = async (formData) => {
  try {
    // Accept either FormData or plain object (but preferred: FormData)
    let payload = formData;
    if (!(formData instanceof FormData) && typeof formData === "object") {
      const fd = new FormData();
      if (formData.name !== undefined) fd.append("Name", formData.name);
      if (formData.description !== undefined) fd.append("Description", formData.description);
      if (formData.price !== undefined) fd.append("Price", formData.price);
      if (formData.stockQuantity !== undefined) fd.append("StockQuantity", formData.stockQuantity);
      if (formData.categoryId !== undefined && formData.categoryId !== "") fd.append("CategoryId", formData.categoryId);
      if (formData.petTypeId !== undefined && formData.petTypeId !== "") fd.append("PetTypeId", formData.petTypeId);
      if (Array.isArray(formData.images)) {
        formData.images.forEach((f) => fd.append("images", f)); // note: creation endpoint earlier accepted images param separately — backend will accept 'images' too.
      }
      payload = fd;
    }

    const res = await api.post("/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("createProduct error:", err);
    throw err;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    // payload may be a FormData or a plain object
    let fd;
    if (payload instanceof FormData) {
      fd = payload;
    } else {
      fd = new FormData();
      if (payload.name !== undefined) fd.append("Name", payload.name);
      if (payload.description !== undefined) fd.append("Description", payload.description);
      if (payload.price !== undefined) fd.append("Price", payload.price);
      if (payload.stockQuantity !== undefined) fd.append("StockQuantity", payload.stockQuantity);
      if (payload.categoryId !== undefined && payload.categoryId !== "") fd.append("CategoryId", payload.categoryId);
      if (payload.petTypeId !== undefined && payload.petTypeId !== "") fd.append("PetTypeId", payload.petTypeId);
      // If payload.images is array of File
      if (Array.isArray(payload.images)) {
        payload.images.forEach((file) => fd.append("Images", file));
      }
    }

    // Do PUT to /{id} with multipart/form-data
    const res = await api.put(`/${id}`, fd, {
      // don't manually set boundary — let browser set it
      headers: { "Content-Type": "multipart/form-data" },
      // axios will return 204 No Content on success — res.data may be empty
    });
    return res.data;
  } catch (err) {
    console.error("updateProduct error:", err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/${id}`);
    return res.data;
  } catch (err) {
    console.error("deleteProduct error:", err);
    throw err;
  }
};

export const deleteProductImage = async (productId, imageId) => {
  try {
    const res = await api.delete(`/${productId}/image/${imageId}`);
    return res.data;
  } catch (err) {
    console.error("deleteProductImage error:", err);
    throw err;
  }
};

export const deleteImageById = async (imageId) => {
  try {
    const res = await api.delete(`/image/${imageId}`);
    return res.data;
  } catch (err) {
    console.error("deleteImageById error:", err);
    throw err;
  }
};

export const getAllCategories = async () => {
  try {
    const res = await api.get("/categories");
    return res.data ?? [];
  } catch (err) {
    console.error("getAllCategories error:", err);
    throw err;
  }
};

export const createCategory = async (category) => {
  try {
    const res = await api.post("/categories", category);
    return res.data;
  } catch (err) {
    console.error("createCategory error:", err);
    throw err;
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  deleteImageById,
  getAllCategories,
  createCategory,
};

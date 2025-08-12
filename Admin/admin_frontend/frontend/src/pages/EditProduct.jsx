// src/pages/EditProduct.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  deleteProductImage,
  getAllCategories,
} from "../services/ProductService";
import "../styles/EditProduct.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 8;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    categoryId: "",
    petTypeId: "",
  });

  const [existingImages, setExistingImages] = useState([]); // { id, imageUrl, isPrimary }
  const [newFiles, setNewFiles] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // object URLs for newFiles
  const previewSetRef = useRef(new Set());
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [petTypes, setPetTypes] = useState([
    // fallback/mock pet types — replace by fetch if you have an endpoint
    { id: 1, name: "Dog" },
    { id: 2, name: "Cat" },
    { id: 3, name: "Bird" },
    { id: 4, name: "Fish" },
    { id: 5, name: "Rabbit" },
  ]);

  useEffect(() => {
    // load categories (if available)
    (async () => {
      try {
        const cats = await getAllCategories();
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        }
      } catch (err) {
        // ignore, keep mock categories if any
      }
    })();
  }, []);

  useEffect(() => {
    // fetch product detail
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (!data) {
          alert("Product not found");
          navigate("/admin/products");
          return;
        }

        setForm({
          name: data.name ?? "",
          price: data.price ?? "",
          stockQuantity: data.stock_quantity ?? data.stockQuantity ?? 0,
          description: data.description ?? "",
          categoryId: data.category_id ?? (data.category?.id ?? "") ?? "",
          petTypeId: data.pet_type_id ?? (data.pet_type?.id ?? "") ?? "",
        });

        // normalize existing images
        const imgs =
          (data.product_images || data.productImages || []).map((img) => ({
            id: img.id ?? img.Id,
            imageUrl: img.image_url ?? img.imageUrl ?? img.url ?? null,
            isPrimary: img.is_primary ?? img.isPrimary ?? false,
          })) || [];

        setExistingImages(imgs);
      } catch (err) {
        console.error("Failed to load product:", err);
        alert("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      // revoke created object URLs
      previewSetRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      previewSetRef.current.clear();
    };
  }, [id, navigate]);

  const toFullUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/100";
    const trimmed = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `https://localhost:44337/${trimmed}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleNewFiles = (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const allowed = [];
    const urls = [];
    for (const f of filesList) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_FILE_SIZE) {
        alert(`File "${f.name}" is larger than 10MB and was skipped.`);
        continue;
      }
      if (newFiles.length + allowed.length >= MAX_FILES) break;
      allowed.push(f);
      const url = URL.createObjectURL(f);
      urls.push(url);
      previewSetRef.current.add(url);
    }
    if (allowed.length === 0) return;
    setNewFiles((prev) => [...prev, ...allowed].slice(0, MAX_FILES));
    setPreviews((prev) => [...prev, ...urls].slice(0, MAX_FILES));
    // reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onNewFilesChange = (e) => {
    handleNewFiles(Array.from(e.target.files || []));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleNewFiles(Array.from(e.dataTransfer.files || []));
  };
  const handleDragOver = (e) => e.preventDefault();

  const removeNewFile = (index) => {
    const url = previews[index];
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
      previewSetRef.current.delete(url);
    }
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteProductImage(id, imageId);
      // remove locally
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("delete existing image failed", err);
      alert("Failed to delete image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (!form.name || !form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (form.price === "" || isNaN(Number(form.price))) {
      alert("Enter valid price");
      return;
    }
    if (form.stockQuantity === "" || isNaN(Number(form.stockQuantity))) {
      alert("Enter valid stock quantity");
      return;
    }

    setLoading(true);
    try {
      // build FormData matching ProductFormDTO
      const fd = new FormData();
      fd.append("Name", form.name);
      fd.append("Description", form.description ?? "");
      fd.append("Price", form.price);
      fd.append("StockQuantity", form.stockQuantity);
      if (form.categoryId !== "" && form.categoryId !== null && form.categoryId !== undefined) {
        fd.append("CategoryId", form.categoryId);
      }
      if (form.petTypeId !== "" && form.petTypeId !== null && form.petTypeId !== undefined) {
        fd.append("PetTypeId", form.petTypeId);
      }

      // append new files (if any) using "Images" multiple key
      newFiles.forEach((f) => {
        fd.append("Images", f);
      });

      await updateProduct(id, fd);

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("update failed", err);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>

      <form className="edit-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹):</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity:</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category:</label>
            <select name="categoryId" value={form.categoryId ?? ""} onChange={handleInputChange}>
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id ?? c.Id} value={c.id ?? c.Id}>
                  {c.name ?? c.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pet Type:</label>
            <select name="petTypeId" value={form.petTypeId ?? ""} onChange={handleInputChange}>
              <option value="">Any</option>
              {petTypes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={form.description} onChange={handleInputChange} />
        </div>

        {/* Existing images */}
        <div className="form-group">
          <label>Existing Images</label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {existingImages.length === 0 && <div>No images</div>}
            {existingImages.map((img) => (
              <div key={img.id} style={{ textAlign: "center" }}>
                <img
                  src={toFullUrl(img.imageUrl)}
                  alt="existing"
                  style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6 }}
                />
                <div style={{ marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    style={{
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new images */}
        <div className="form-group">
          <label>Upload New Images (first new image will be primary if product has no primary)</label>
          <div
            className="image-upload-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: 18,
              border: "1px dashed #ccc",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onNewFilesChange}
              hidden
            />
            <div style={{ textAlign: "center", color: "#666" }}>
              Click to select or drag & drop images (max {MAX_FILES}). First will be primary if none existing.
            </div>
          </div>

          {previews.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {previews.map((src, idx) => (
                <div key={src + idx} style={{ position: "relative", width: 120 }}>
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "none",
                      background: "#ff3860",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  {idx === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 6,
                        top: 6,
                        background: "#209cee",
                        color: "#fff",
                        padding: "4px 6px",
                        fontSize: 12,
                        borderRadius: 6,
                      }}
                    >
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          <button type="button" onClick={() => navigate("/admin/products")} style={{ marginRight: 12 }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={{ background: "#209cee", color: "#fff", padding: "8px 14px", borderRadius: 6, border: "none" }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

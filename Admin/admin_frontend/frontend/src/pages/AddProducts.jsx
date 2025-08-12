// src/pages/AddProducts.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/ProductService"; // IMPORTANT: exact lowercase filename
import "../styles/add-products.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 8;

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const urlSetRef = useRef(new Set()); // track object URLs for cleanup

  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    petTypeId: "",
    price: "",
    stockQuantity: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [files, setFiles] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // object URLs
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fill from your MySQL tables (product_categories and pet_types)
    setCategories([
      { id: 1, name: "Food" },
      { id: 2, name: "Toys" },
      { id: 3, name: "Accessories" },
      { id: 4, name: "Grooming Supplies" },
      { id: 5, name: "Health Products" },
    ]);

    setPetTypes([
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
      { id: 3, name: "Bird" },
      { id: 4, name: "Fish" },
      { id: 5, name: "Rabbit" },
      { id: 6, name: "Hamster" },
      { id: 7, name: "Turtle" },
      { id: 8, name: "Guinea Pig" },
    ]);

    return () => {
      // cleanup created object URLs on unmount
      urlSetRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      urlSetRef.current.clear();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      // keep number inputs as numbers (or empty string)
      [name]:
        name === "price" || name === "stockQuantity"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const addFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const toAdd = [];
    const previewUrls = [];

    for (const f of newFiles) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_FILE_SIZE) {
        alert(`File "${f.name}" is larger than 10MB and was skipped.`);
        continue;
      }
      if (files.length + toAdd.length >= MAX_FILES) break;
      toAdd.push(f);
      const url = URL.createObjectURL(f);
      previewUrls.push(url);
      urlSetRef.current.add(url);
    }

    if (files.length + toAdd.length > MAX_FILES) {
      alert(
        `You can upload up to ${MAX_FILES} images. Extra files were ignored.`
      );
    }

    setFiles((prev) => [...prev, ...toAdd].slice(0, MAX_FILES));
    setPreviews((prev) => [...prev, ...previewUrls].slice(0, MAX_FILES));
  };

  const handleImageChange = (e) => {
    addFiles(Array.from(e.target.files || []));
    // reset input so user can select same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index) => {
    const url = previews[index];
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
      urlSetRef.current.delete(url);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!product.name || !product.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (
      product.price === "" ||
      isNaN(product.price) ||
      Number(product.price) < 0
    ) {
      alert("Please enter a valid price (>= 0).");
      return;
    }
    if (
      product.stockQuantity === "" ||
      isNaN(product.stockQuantity) ||
      Number(product.stockQuantity) < 0
    ) {
      alert("Please enter a valid stock quantity (>= 0).");
      return;
    }
    if (files.length === 0) {
      if (!window.confirm("No images uploaded. Continue without images?"))
        return;
    }

    setLoading(true);
    try {
      // Convert to FormData so images are actually uploaded
      const formData = new FormData();
      formData.append("name", product.name.trim());
      if (product.categoryId) formData.append("categoryId", product.categoryId);
      if (product.petTypeId) formData.append("petTypeId", product.petTypeId);
      formData.append("price", product.price);
      formData.append("stockQuantity", product.stockQuantity);
      formData.append("description", product.description || "");
      files.forEach((file) => formData.append("images", file));

      await createProduct(formData); // send FormData directly

      alert("Product created successfully.");
      navigate("/admin/products");
    } catch (err) {
      console.error("createProduct failed:", err);
      alert("Failed to create product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Product</h1>

      <div className="product-form-container">
        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  name="categoryId"
                  value={product.categoryId || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Pet Type</label>
                <select
                  name="petTypeId"
                  value={product.petTypeId || ""}
                  onChange={handleChange}
                >
                  <option value="">Any</option>
                  {petTypes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={product.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={product.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3>Product Images</h3>

            <div
              className="image-upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") fileInputRef.current?.click();
              }}
            >
              <input
                ref={fileInputRef}
                id="imageInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                hidden
              />
              <div className="upload-placeholder">
                <span>+</span>
                <p>Click to upload or drag & drop</p>
                <p>PNG, JPG, GIF up to 10MB (first image will be primary)</p>
                <p style={{ fontSize: 12, opacity: 0.8 }}>
                  {files.length}/{MAX_FILES} uploaded
                </p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="image-preview-grid">
                {previews.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className={`image-preview ${idx === 0 ? "primary" : ""}`}
                  >
                    <img src={src} alt={`Preview ${idx + 1}`} />
                    {idx === 0 && <div className="primary-badge">Primary</div>}
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/products")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

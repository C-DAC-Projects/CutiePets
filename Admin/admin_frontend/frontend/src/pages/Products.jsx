// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  getProductById,
  deleteProduct,
  deleteProductImage
} from "../services/ProductService";

import "../styles/Products.css";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProductsWithImages();
  }, []);

  const toFullUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/80";
    const trimmed = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return `https://localhost:44337/${trimmed}`;
  };

  const fetchProductsWithImages = async () => {
    setLoading(true);
    try {
      const summaries = await getAllProducts();

      if (!Array.isArray(summaries)) {
        setProducts([]);
        return;
      }

      const detailPromises = summaries.map((s) =>
        getProductById(s.id ?? s.Id ?? s.ID).catch((err) => {
          console.error("getProductById failed for", s, err);
          return null;
        })
      );
      const details = await Promise.all(detailPromises);

      const formatted = summaries.map((s) => {
        const id = s.id ?? s.Id ?? s.ID;
        const detail = (details || []).find(
          (d) => d && (d.id === id || d.Id === id)
        ) || {};
        const rawImages =
          detail.product_images ??
          detail.productImages ??
          detail.product_images_list ??
          [];

        const images = (rawImages || []).map((img) => ({
          id: img.id ?? img.Id ?? img.image_id ?? null,
          imageUrl:
            img.image_url ?? img.imageUrl ?? img.url ?? null,
          isPrimary: img.is_primary ?? img.isPrimary ?? false,
        }));

        return {
          id,
          name: s.name ?? s.Name ?? "",
          category: s.category ?? s.Category ?? "",
          price: s.price ?? s.Price ?? 0,
          stock:
            s.stockQuantity ??
            s.StockQuantity ??
            s.stock_quantity ??
            0,
          available:
            s.available ??
            s.Available ??
            !!(
              s.stockQuantity ??
              s.StockQuantity ??
              s.stock_quantity
            ),
          primaryImageUrl: s.primaryImageUrl ?? s.PrimaryImageUrl ?? null,
          images,
        };
      });

      setProducts(formatted);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Failed to load products. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  const handleDeleteImage = async (productId, imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteProductImage(productId, imageId);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, images: p.images.filter((img) => img.id !== imageId) }
            : p
        )
      );
    } catch (err) {
      console.error("Error deleting product image:", err);
      alert("Failed to delete image.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Products Management</h1>

      <div className="products-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button onClick={() => fetchProductsWithImages()}>Refresh</button>
        </div>

        <div className="filter-section">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Toys">Toys</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <button
          className="add-product-btn"
          onClick={() => navigate("/admin/products/add")}
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <table className="products-table" role="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Images</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 20 }}>
                    No products found
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <img
                          className="product-image"
                          src={
                            product.images && product.images.length > 0
                              ? toFullUrl(
                                  product.images.find((i) => i.isPrimary)
                                    ?.imageUrl ??
                                    product.images[0]?.imageUrl
                                )
                              : product.primaryImageUrl
                              ? toFullUrl(product.primaryImageUrl)
                              : "https://via.placeholder.com/60"
                          }
                          alt={product.name}
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/60")
                          }
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>

                    <td>{product.category || "N/A"}</td>
                    <td>
                      ₹
                      {typeof product.price === "number"
                        ? product.price.toFixed(2)
                        : product.price}
                    </td>
                    <td>{product.stock ?? 0}</td>

                    <td>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {product.images && product.images.length > 0 ? (
                          product.images.map((img) => (
                            <div key={img.id} style={{ textAlign: "center" }}>
                              <img
                                src={toFullUrl(img.imageUrl)}
                                alt={product.name}
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                }}
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/80")
                                }
                              />
                              <div style={{ marginTop: 6 }}>
                                <button
                                  className="table-actions"
                                  onClick={() =>
                                    handleDeleteImage(product.id, img.id)
                                  }
                                  style={{
                                    fontSize: 12,
                                    padding: "6px 8px",
                                    background: "#ff4d4f",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                  }}
                                >
                                  Delete Image
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <img
                            src="https://via.placeholder.com/80"
                            alt="no-image"
                            style={{ width: 80, height: 80 }}
                          />
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          product.available ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td className="table-actions">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.id}`)
                        }
                        style={{
                          background: "#209cee",
                          color: "#fff",
                          padding: "6px 10px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          background: "#ff3860",
                          color: "#fff",
                          padding: "6px 10px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          marginLeft: 8,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls" style={{ marginTop: 20, textAlign: "center" }}>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => goToPage(idx + 1)}
                  className={currentPage === idx + 1 ? "active" : ""}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

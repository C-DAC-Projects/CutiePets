// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { FaPaw, FaBox, FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getPetsCount, getProductsCount } from "../services/DashboardService";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPets: null,
    totalProducts: null,
    pendingProductOrders: null, // Will not be fetched
    pendingPetOrders: null, // Will not be fetched
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [petsCount, productsCount] = await Promise.all([
          getPetsCount(),
          getProductsCount(),
        ]);

        setStats({
          totalPets: petsCount,
          totalProducts: productsCount,
          pendingPetOrders: null, // No API call
          pendingProductOrders: null, // No API call
        });
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return <div className="dashboard-container">Loading dashboard...</div>;

  const data = [
    {
      title: "Total Pets",
      value: stats.totalPets,
      icon: <FaPaw />,
      link: "/admin/pets",
      color: "#00d1b2",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBox />,
      link: "/admin/products",
      color: "#209cee",
    },
    {
      title: "Product Orders",
      value:
        stats.pendingProductOrders !== null ? stats.pendingProductOrders : "",
      icon: <FaShoppingCart />,
      link: "/admin/orders/products",
      color: "#ff3860",
    },
    {
      title: "Pet Orders",
      value: stats.pendingPetOrders !== null ? stats.pendingPetOrders : "",
      icon: <FaClipboardList />,
      link: "/admin/orders/pets",
      color: "#48c78e",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-cards">
        {data.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="dashboard-card"
            style={{ borderLeftColor: item.color }}
          >
            <div className="card-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              {item.value !== "" && <p>{item.value}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

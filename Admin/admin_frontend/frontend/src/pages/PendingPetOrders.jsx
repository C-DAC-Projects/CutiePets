import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../styles/pendingPetOrders.css";
import { useNavigate } from "react-router-dom";

const PendingPetOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  // Dummy data toggle
  const useDummyData = true;

  const dummyOrders = [
    {
      id: 1,
      orderNumber: "PET1001",
      createdAt: "2025-08-01T10:00:00Z",
      status: "PENDING",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "9876543210",
      pet: { name: "Bruno", breed: { name: "Labrador" }, price: 5500 }
    },
    {
      id: 2,
      orderNumber: "PET1002",
      createdAt: "2025-08-03T14:30:00Z",
      status: "PROCESSING",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      customerPhone: "9865312422",
      pet: { name: "Whiskers", breed: { name: "Persian Cat" }, price: 3200 }
    },
    {
      id: 3,
      orderNumber: "PET1003",
      createdAt: "2025-08-06T09:15:00Z",
      status: "COMPLETED",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      customerPhone: "9812345678",
      pet: { name: "Tweety", breed: { name: "Parrot" }, price: 900 }
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (useDummyData) {
          setOrders(dummyOrders);
        } else {
          // const response = await api.get("/api/orders/pets");
          // setOrders(response.data.orders || []);
          toast.warning("Real API not connected. Showing dummy data.");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load pet orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtered data
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="page-container">Loading orders...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Pending Pet Orders</h1>

      {/* Controls */}
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by name, email, phone, or pet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <p>No orders match your filters.</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order No</th>
                <th>Date</th>
                <th>Status</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Pet</th>
                <th>Breed</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        order.status.toLowerCase()
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.pet?.name || "-"}</td>
                  <td>{order.pet?.breed?.name || "-"}</td>
                  <td>₹{order.pet?.price?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingPetOrders;

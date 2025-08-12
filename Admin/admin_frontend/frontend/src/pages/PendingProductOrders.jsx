import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/pendingProductOrders.css"; // New CSS file

const PendingProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const navigate = useNavigate();

  const useDummyData = true;

  const dummyOrders = [
    {
      id: 1,
      orderNumber: "PROD-001",
      createdAt: "2025-08-01T10:00:00Z",
      status: "PENDING",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "9876543210",
      totalAmount: 1450,
      items: [
        { productName: "Dog Food", quantity: 2, price: 500 },
        { productName: "Chew Toy", quantity: 1, price: 450 }
      ]
    },
    {
      id: 2,
      orderNumber: "PROD-002",
      createdAt: "2025-08-03T14:30:00Z",
      status: "PROCESSING",
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      customerPhone: "9865312422",
      totalAmount: 899,
      items: [
        { productName: "Cat Litter", quantity: 1, price: 400 },
        { productName: "Cat Treats", quantity: 2, price: 249.5 }
      ]
    },
    {
      id: 3,
      orderNumber: "PROD-003",
      createdAt: "2025-08-06T09:15:00Z",
      status: "COMPLETED",
      customerName: "Amit Patel",
      customerEmail: "amit@example.com",
      customerPhone: "9812345678",
      totalAmount: 1000,
      items: [
        { productName: "Bird Cage", quantity: 1, price: 1000 }
      ]
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (useDummyData) {
          setOrders(dummyOrders);
        } else {
          // const response = await api.get("/api/orders/products");
          // setOrders(response.data.orders || []);
          toast.warning("Dummy data displayed. Connect real API to fetch data.");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error("Failed to load product orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="page-container">Loading orders...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Pending Product Orders</h1>

      {/* Search & Filter Controls */}
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search by name, email, phone, or order no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No matching orders found.</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order No</th>
                <th>Date</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.customerPhone}</td>
                  <td>
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        • {item.productName} x{item.quantity} (₹{item.price})
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingProductOrders;

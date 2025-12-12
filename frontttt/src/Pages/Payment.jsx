import React, { useState, useEffect } from "react";
import { createPaymentOrder } from "../services/paymentApi";

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  useEffect(() => {
    // Get order code from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("orderCode") || localStorage.getItem("currentOrderCode");
    if (code) setOrderCode(code);
  }, []);

  // Load PayPal SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      console.log("PayPal SDK loaded");
    };
    document.head.appendChild(script);
  }, []);

  const startPayPalPayment = async () => {
    if (!orderCode) return alert("Order code not found!");

    setLoading(true);
    try {
      // 1️⃣ Create PayPal order on backend
      const paymentData = await createPaymentOrder(orderCode);
      const paypalOrderId = paymentData.paypal_order.id;
      const approvalUrl = paymentData.paypal_order.links.find(
        (link) => link.rel === "approve"
      )?.href;

      if (!approvalUrl) throw new Error("No approval URL found");

      // Store PayPal order ID for verification later
      localStorage.setItem("currentPayPalOrderID", paypalOrderId);

      // 2️⃣ Redirect to PayPal approval
      window.location.href = approvalUrl;
    } catch (err) {
      console.error("Error creating payment:", err);
      alert("Failed to create payment: " + err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>🎂 Bakery Payment</h2>
      <p>Order Code: <strong>{orderCode || "Loading..."}</strong></p>

      <button
        onClick={startPayPalPayment}
        disabled={loading || !orderCode}
        style={{
          width: "100%",
          padding: "15px",
          marginTop: "20px",
          backgroundColor: "#0070ba",
          color: "white",
          borderRadius: "6px",
          border: "none",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "💳 Pay with PayPal"}
      </button>
    </div>
  );
};

export default PaymentPage;

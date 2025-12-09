import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "http://localhost:5000/api"; // change if needed

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

const startPayment = async () => {
  if (!amount) return alert("Enter amount!");

  setLoading(true);
  const userId = "67abc123xyz"; // replace or use auth user
  const orderCode = "BKR-2025-11-21-ABC123"; // match the order_code in DB

  try {
    // 1️⃣ Load Razorpay Script
    const ok = await loadRazorpay();
    if (!ok) return alert("Failed to load Razorpay");

    // 2️⃣ Create order on backend
    const { data } = await axios.post(`${backendURL}/payment/create-order`, {
      userId,
      orderCode,
    });

    const payment = data.payment;
    const razorpay_order = data.razorpay_order;

    // 3️⃣ Razorpay Options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpay_order.amount,
      currency: "INR",
      name: "Bakery Ordering",
      description: "Payment for bakery order",
      order_id: razorpay_order.id,

      handler: async function (response) {
        // 4️⃣ Verify payment on backend
        const verifyRes = await axios.post(`${backendURL}/payment/verify`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.data.success) {
          alert("🎉 Payment Successful!");
          window.location.href = "/payment-success";
        } else {
          alert("❌ Payment Failed");
        }
      },

      prefill: {
        name: "Sample User",
        email: "user@example.com",
        contact: "9876543210",
      },

      theme: { color: "#F37254" },
    };

    // 5️⃣ Open Razorpay Popup
    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      alert("Payment Failed! Try again.");
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "auto" }}>
      <h2>Pay Using Razorpay</h2>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={startPayment}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          backgroundColor: "#0f9d58",
          color: "white",
          borderRadius: "6px",
          border: "none",
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { verifyPayment } from "../services/paymentApi";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get orderID from localStorage or from PayPal token in URL
        let orderID = urlParams.get("orderID") || urlParams.get("token");
        
        if (!orderID) {
          // Try to get from localStorage if not in URL
          orderID = localStorage.getItem("currentPayPalOrderID");
        }

        if (!orderID) {
          setStatus("error");
          setMessage("Order ID not found. Please try again.");
          return;
        }

        // Verify payment with backend
        const result = await verifyPayment(orderID);

        if (result.success) {
          setStatus("success");
          setMessage(`Payment verified! Your order #${result.orderId} has been confirmed.`);
          // Show payment success toast
          toast.success("Payment successful! Thank you for your order.");
          // Set flag to show order placed toast on home page
          localStorage.setItem("showOrderPlacedToast", "true");
          // Clear the stored order code
          localStorage.removeItem("currentOrderCode");
          localStorage.removeItem("currentPayPalOrderID");
        } else {
          setStatus("error");
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(`Error: ${err.response?.data?.message || err.message}`);
      }
    };

    verifyPaymentStatus();
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center", minHeight: "60vh" }}>
      {status === "verifying" && (
        <>
          <h2>⏳ Verifying Payment...</h2>
          <p>Please wait while we confirm your payment with PayPal.</p>
        </>
      )}

      {status === "success" && (
        <>
          <h1>🎉 Payment Successful!</h1>
          <p>{message}</p>
          <p>Your bakery order has been confirmed and will be prepared soon.</p>
          <a href="/" style={{ fontSize: "16px", color: "#0070ba", textDecoration: "underline" }}>
            ← Back to Home
          </a>
        </>
      )}

      {status === "error" && (
        <>
          <h1>❌ Payment Verification Failed</h1>
          <p>{message}</p>
          <a href="/payment" style={{ fontSize: "16px", color: "#0070ba", textDecoration: "underline" }}>
            ← Try Payment Again
          </a>
        </>
      )}
    </div>
  );
}

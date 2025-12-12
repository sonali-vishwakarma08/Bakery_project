import React, { useEffect, useState } from "react";
import { verifyPayment } from "../services/paymentApi";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  const [redirectTimer, setRedirectTimer] = useState(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        // Get query parameters from URL
        // Handle potential URL encoding issues
        const urlParams = new URLSearchParams(window.location.search);
        
        // PayPal sends ?token=ORDER_ID&PayerID=PAYER_ID
        let orderID = urlParams.get("token");
        
        // Decode URI component in case of encoding issues
        if (orderID) {
          orderID = decodeURIComponent(orderID);
        }
        
        // If no token, try to get from localStorage
        if (!orderID) {
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
          setMessage(`Payment verified! Your order has been confirmed.`);
          // Set flag to show order placed toast on home page
          localStorage.setItem("showOrderPlacedToast", "true");
          // Clear the stored order code
          localStorage.removeItem("currentOrderCode");
          localStorage.removeItem("currentPayPalOrderID");
          
          // Set a timer to redirect to home page after 10 seconds
          const timer = setTimeout(() => {
            window.location.href = "/";
          }, 10000);
          setRedirectTimer(timer);
        } else {
          setStatus("error");
          // Show user-friendly error message
          let errorMessage = result.message || "Payment verification failed. Please contact support.";
          
          // Handle PayPal-specific errors
          if (errorMessage.includes("INSTRUMENT_DECLINED")) {
            errorMessage = "Payment method was declined. This commonly happens in PayPal Sandbox mode. Please try again with a different payment method.";
          } else if (errorMessage.includes("UNPROCESSABLE_ENTITY")) {
            errorMessage = "Unable to process payment. Please try another payment method.";
          }
          
          setMessage(errorMessage);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        // Better error handling with user-friendly messages
        let errorMessage = "Payment verification failed. Please contact support.";
        if (err && typeof err === 'object') {
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
            
            // Handle PayPal-specific errors
            if (errorMessage.includes("INSTRUMENT_DECLINED")) {
              errorMessage = "Payment method was declined. This commonly happens in PayPal Sandbox mode. Please try again with a different payment method.";
            } else if (errorMessage.includes("UNPROCESSABLE_ENTITY")) {
              errorMessage = "Unable to process payment. Please try another payment method.";
            }
          } else if (err.message) {
            errorMessage = err.message;
          }
        } else if (typeof err === 'string') {
          errorMessage = err;
          
          // Handle PayPal-specific errors
          if (errorMessage.includes("INSTRUMENT_DECLINED")) {
            errorMessage = "Payment method was declined. This commonly happens in PayPal Sandbox mode. Please try again with a different payment method.";
          } else if (errorMessage.includes("UNPROCESSABLE_ENTITY")) {
            errorMessage = "Unable to process payment. Please try another payment method.";
          }
        }
        setMessage(errorMessage);
      }
    };

    verifyPaymentStatus();
    
    // Cleanup function to clear timer if component unmounts
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, []);

  const handleGoHome = () => {
    // Clear any existing timer
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    // Redirect to home page
    window.location.href = "/";
  };

  const handleTryAgain = () => {
    // Clear any existing timer
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    // Redirect to payment page
    window.location.href = "/payment";
  };

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
          <p>You will be redirected to the home page in 10 seconds...</p>
          <button 
            onClick={handleGoHome}
            style={{ 
              fontSize: "16px", 
              color: "#0070ba", 
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            ← Go to Home Now
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>❌ Payment Verification Failed</h1>
          <p>{message}</p>
          <button 
            onClick={handleTryAgain}
            style={{ 
              fontSize: "16px", 
              color: "#0070ba", 
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            ← Try Payment Again
          </button>
        </>
      )}
    </div>
  );
}
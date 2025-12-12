import React from "react";

export default function PaymentCancel() {
  const handleTryAgain = () => {
    // Redirect to payment page
    window.location.href = "/payment";
  };

  const handleGoHome = () => {
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 40, textAlign: "center", minHeight: "60vh" }}>
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled. No charges have been made to your account.</p>
      <p>If you wish to complete your order, you can try making the payment again.</p>
      
      <div style={{ marginTop: 30 }}>
        <button 
          onClick={handleTryAgain}
          style={{ 
            fontSize: "16px", 
            color: "#0070ba", 
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginRight: "20px"
          }}
        >
          ← Try Payment Again
        </button>
        
        <button 
          onClick={handleGoHome}
          style={{ 
            fontSize: "16px", 
            color: "#0070ba", 
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
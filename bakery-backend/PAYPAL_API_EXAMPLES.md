# PayPal Payment API - Quick Reference & Examples

## 1. Create Order

**Endpoint:** `POST /api/payment/create-order`

### Request
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderCode": "ORD-2024-001"
  }'
```

### Response
```json
{
  "success": true,
  "payment": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
    "order": "65a4b5c1e2d8f3g4h5i6j7l9",
    "user": "65a4b5c1e2d8f3g4h5i6j7m0",
    "gateway": "paypal",
    "gateway_order_id": "4W999997H4296821P",
    "amount": 25.99,
    "tax_amount": 2.50,
    "currency": "USD",
    "payment_status": "created",
    "is_verified": false,
    "createdAt": "2024-12-09T10:30:00.000Z"
  },
  "paypal_order": {
    "id": "4W999997H4296821P",
    "status": "CREATED",
    "links": [
      {
        "rel": "approve",
        "href": "https://www.sandbox.paypal.com/checkoutnow?token=4W999997H4296821P"
      }
    ]
  },
  "client_id": "AbcDefGhIjklMnOpQrStUvWxYz123456789"
}
```

**Next Steps:**
1. Redirect user to PayPal approval URL: `https://www.sandbox.paypal.com/checkoutnow?token=4W999997H4296821P`
2. User logs in and approves payment
3. PayPal redirects back to your app

---

## 2. Verify Payment

**Endpoint:** `POST /api/payment/verify`

### Request
```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderID": "4W999997H4296821P"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "65a4b5c1e2d8f3g4h5i6j7k8",
  "orderId": "65a4b5c1e2d8f3g4h5i6j7l9"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to verify payment with PayPal",
  "error": "PayPal API error details"
}
```

---

## 3. Refund Payment

**Endpoint:** `POST /api/payment/refund`  
**Auth:** Admin only

### Full Refund
```bash
curl -X POST http://localhost:5000/api/payment/refund \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "65a4b5c1e2d8f3g4h5i6j7k8",
    "reason": "Customer requested cancellation"
  }'
```

### Partial Refund
```bash
curl -X POST http://localhost:5000/api/payment/refund \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "65a4b5c1e2d8f3g4h5i6j7k8",
    "refundAmount": 10.50,
    "reason": "Partial refund for 2 items"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "payment": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
    "payment_status": "refunded",
    "refund_id": "1H234567890ABCDEF",
    "refund_amount": 25.99,
    "refund_reason": "Customer requested cancellation",
    "refunded_at": "2024-12-09T11:45:00.000Z"
  }
}
```

---

## 4. Cancel Payment

**Endpoint:** `POST /api/payment/cancel`  
**Auth:** Admin only

### Request
```bash
curl -X POST http://localhost:5000/api/payment/cancel \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "65a4b5c1e2d8f3g4h5i6j7k8",
    "reason": "Order cancelled by admin"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Payment cancelled successfully",
  "payment": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
    "payment_status": "failed",
    "gateway_response": {
      "cancelled_reason": "Order cancelled by admin"
    }
  }
}
```

---

## 5. Retry Failed Payment

**Endpoint:** `POST /api/payment/retry`

### Request
```bash
curl -X POST http://localhost:5000/api/payment/retry \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "65a4b5c1e2d8f3g4h5i6j7k8"
  }'
```

### Response
```json
{
  "success": true,
  "message": "New payment order created for retry",
  "payment": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
    "payment_status": "created",
    "gateway_order_id": "5X000008I5307932Q",
    "amount": 25.99
  },
  "paypal_order": {
    "id": "5X000008I5307932Q",
    "status": "CREATED",
    "links": [
      {
        "rel": "approve",
        "href": "https://www.sandbox.paypal.com/checkoutnow?token=5X000008I5307932Q"
      }
    ]
  },
  "client_id": "AbcDefGhIjklMnOpQrStUvWxYz123456789"
}
```

---

## 6. Get Payment Details

**Endpoint:** `GET /api/payment/details/:id`  
**Endpoint:** `POST /api/payment/details`

### GET Request
```bash
curl -X GET http://localhost:5000/api/payment/details/65a4b5c1e2d8f3g4h5i6j7k8 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### POST Request
```bash
curl -X POST http://localhost:5000/api/payment/details \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "65a4b5c1e2d8f3g4h5i6j7k8"
  }'
```

### Response
```json
{
  "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
  "order": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7l9",
    "order_code": "ORD-2024-001",
    "user": "65a4b5c1e2d8f3g4h5i6j7m0",
    "final_amount": 25.99,
    "items": [...]
  },
  "user": {
    "_id": "65a4b5c1e2d8f3g4h5i6j7m0",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "gateway": "paypal",
  "gateway_order_id": "4W999997H4296821P",
  "gateway_payment_id": "5HX000007H4296821A",
  "amount": 25.99,
  "tax_amount": 2.50,
  "currency": "USD",
  "payment_status": "success",
  "payment_method": "paypal",
  "is_verified": true,
  "paid_at": "2024-12-09T10:45:00.000Z",
  "createdAt": "2024-12-09T10:30:00.000Z",
  "updatedAt": "2024-12-09T10:45:00.000Z"
}
```

---

## 7. List All Payments

**Endpoint:** `GET /api/payment`  
**Auth:** Admin only

### Request
```bash
# Get all payments
curl -X GET http://localhost:5000/api/payment \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Get with pagination
curl -X GET "http://localhost:5000/api/payment?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Filter by status
curl -X GET "http://localhost:5000/api/payment?paymentStatus=success" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Response
```json
{
  "payments": [
    {
      "_id": "65a4b5c1e2d8f3g4h5i6j7k8",
      "order": {
        "_id": "65a4b5c1e2d8f3g4h5i6j7l9",
        "order_code": "ORD-2024-001"
      },
      "user": {
        "_id": "65a4b5c1e2d8f3g4h5i6j7m0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "gateway": "paypal",
      "amount": 25.99,
      "currency": "USD",
      "payment_status": "success",
      "createdAt": "2024-12-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 47,
    "limit": 10
  }
}
```

---

## 8. Payment Statistics

**Endpoint:** `GET /api/payment/stats`  
**Auth:** Admin only

### Request
```bash
# All time stats
curl -X GET http://localhost:5000/api/payment/stats \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Date range stats
curl -X GET "http://localhost:5000/api/payment/stats?startDate=2024-12-01&endDate=2024-12-31" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Response
```json
{
  "stats": {
    "_id": null,
    "totalPayments": 47,
    "successfulPayments": 45,
    "failedPayments": 2,
    "totalAmount": 1234.56,
    "avgAmount": 26.27,
    "totalTax": 120.45,
    "totalRefunded": 52.00
  },
  "byPaymentMethod": [
    {
      "_id": "paypal",
      "count": 45,
      "totalAmount": 1150.00
    },
    {
      "_id": "razorpay",
      "count": 2,
      "totalAmount": 84.56
    }
  ]
}
```

---

## Frontend Example - React with PayPal

```jsx
import { PayPalButtons } from "@paypal/checkout-js";
import axios from "axios";

function PaymentComponent({ orderCode }) {
  const [paymentData, setPaymentData] = useState(null);

  // Step 1: Create order on backend
  const createPaymentOrder = async () => {
    try {
      const response = await axios.post(
        '/api/payment/create-order',
        { orderCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setPaymentData(response.data);
      return response.data.paypal_order.id;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  // Step 2: Verify payment on backend
  const onApprove = async (orderID) => {
    try {
      const response = await axios.post(
        '/api/payment/verify',
        { orderID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        alert('Payment successful!');
        // Redirect to success page
        window.location.href = '/payment/success';
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed');
    }
  };

  return (
    <PayPalButtons
      createOrder={createPaymentOrder}
      onApprove={(data) => onApprove(data.orderID)}
      onError={(error) => {
        console.error('PayPal error:', error);
        alert('Payment failed');
      }}
    />
  );
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing fields, invalid data) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not found (payment/order not found) |
| 500 | Server error (PayPal API error) |

---

## Error Codes & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Order not found" | Order code doesn't exist | Verify order was created in system |
| "Missing required fields" | orderCode or orderID missing | Check request body |
| "Payment signature verification failed" | Invalid token | Re-authenticate |
| "Failed to verify payment with PayPal" | PayPal API error | Check PayPal status, retry later |
| "Cannot refund non-success payments" | Payment not completed | Only refund successful payments |
| "Cannot cancel payment with status: success" | Can't cancel completed payment | Use refund endpoint instead |

---

**Last Updated:** December 2024  
**PayPal SDK Version:** @paypal/checkout-server-sdk@1.0.1

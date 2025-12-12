# PayPal Payment Gateway Integration Guide

## Overview
The bakery application now uses **PayPal** as the primary payment gateway for processing customer payments. This replaces the previous Razorpay integration.

## Environment Variables
Update your `.env` file with the following PayPal credentials:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=AbcDefGhIjklMnOpQrStUvWxYz123456789
PAYPAL_SECRET=1234567890abcdefghijkLMNOPQRST
PAYPAL_MODE=sandbox  # Use 'sandbox' for testing, 'live' for production
```

**Getting Your Credentials:**
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create/log into your developer account
3. Navigate to Apps & Credentials
4. Select Sandbox mode (for testing)
5. Copy your Client ID and Secret from the REST API signature section

## Payment Flow

### 1. Create Order (Frontend → Backend)
**Endpoint:** `POST /api/payment/create-order`
**Auth:** Required (User must be logged in)

**Request:**
```json
{
  "orderCode": "ORDER_CODE_FROM_ORDER_MODEL"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "_id": "payment_id",
    "gateway": "paypal",
    "gateway_order_id": "PAYPAL_ORDER_ID",
    "amount": 25.99,
    "currency": "USD",
    "payment_status": "created"
  },
  "paypal_order": {
    "id": "PAYPAL_ORDER_ID",
    "status": "CREATED",
    "links": [...]
  },
  "client_id": "YOUR_PAYPAL_CLIENT_ID"
}
```

### 2. Redirect to PayPal
Frontend redirects user to PayPal checkout page using the `paypal_order` data.

### 3. Verify Payment (After User Completes Payment)
**Endpoint:** `POST /api/payment/verify`
**Auth:** Required

**Request:**
```json
{
  "orderID": "PAYPAL_ORDER_ID"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "PAYMENT_RECORD_ID",
  "orderId": "BAKERY_ORDER_ID"
}
```

### 4. Webhook (PayPal → Backend)
**Endpoint:** `POST /api/payment/webhook`
**Auth:** Not required (PayPal calls this)

PayPal automatically sends webhooks for:
- `CHECKOUT.ORDER.COMPLETED` - Order successfully captured
- `PAYMENT.CAPTURE.DENIED` - Payment failed
- `PAYMENT.CAPTURE.FAILED` - Payment error

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-order` | ✅ User | Create new PayPal order |
| POST | `/verify` | ✅ User | Verify payment completion |
| POST | `/webhook` | ❌ None | Receive PayPal webhooks |
| POST | `/refund` | ✅ Admin | Process refund |
| POST | `/cancel` | ✅ Admin | Cancel pending payment |
| POST | `/retry` | ✅ User | Retry failed payment |
| GET | `/details/:id` | ✅ User | Get payment details |
| GET | `/` | ✅ Admin | List all payments |
| GET | `/stats` | ✅ Admin | Payment statistics |

## Features

### ✅ Order Creation
- Creates PayPal orders with proper currency conversion (USD)
- Includes itemized breakdown (subtotal, tax, shipping)
- Stores order reference for tracking
- Returns PayPal order ID and client credentials

### ✅ Payment Verification
- Captures PayPal order to complete transaction
- Verifies payment status with PayPal API
- Updates local payment record with full details
- Automatically updates order status to "confirmed"

### ✅ Webhook Processing
- Handles payment completion events
- Updates order status in real-time
- Handles payment failures
- Idempotent webhook handling (safe for retries)

### ✅ Refund Processing
- Full or partial refunds via PayPal API
- Updates payment status (refunded/partially_refunded)
- Tracks refund reason and timestamp
- Updates order status to cancelled

### ✅ Payment Retry
- Allows customers to retry failed payments
- Creates new PayPal order for retry attempt
- Preserves original payment record reference

### ✅ Analytics & Reporting
- Payment statistics by status
- Total revenue tracking
- Payment method breakdown
- Success/failure rates

## Currency
- **Default Currency:** USD
- **Order Amount:** Converted from bakery system currency to USD
- **Example:** If order amount is 500 (system currency), stored as USD value in PayPal

## Testing

### Test Cards (Sandbox Mode)
PayPal provides test accounts. Use these credentials to test:
1. Log into PayPal sandbox with your test account
2. Complete mock transactions
3. Verify webhook deliveries in sandbox

### Test Scenarios
1. **Successful Payment:**
   - Create order → Redirect to PayPal → Approve payment → Verify payment

2. **Failed Payment:**
   - Create order → Reject on PayPal → Use retry endpoint

3. **Refund:**
   - Process successful payment → Call refund endpoint

## Error Handling

### Common Errors

| Error | Status | Reason | Solution |
|-------|--------|--------|----------|
| Order not found | 404 | Invalid order code | Verify order exists |
| Missing credentials | 500 | No PAYPAL_CLIENT_ID in .env | Add PayPal credentials |
| Payment verification failed | 400 | PayPal API error | Check PayPal status |
| Refund failed | 400 | Cannot refund non-success payments | Ensure payment succeeded |
| Order capture failed | 400 | PayPal rejected order | User must retry from PayPal |

## Database Fields

Payment records include:
```javascript
{
  order: ObjectId,           // Reference to bakery order
  user: ObjectId,            // Customer who made payment
  gateway: "paypal",
  gateway_order_id: String,  // PayPal order ID
  gateway_payment_id: String, // PayPal capture/transaction ID
  gateway_response: Object,  // Full PayPal API response
  amount: Number,            // Amount in USD
  tax_amount: Number,
  currency: "USD",
  payment_status: String,    // created|pending|success|failed|refunded|partially_refunded
  payment_method: "paypal",
  is_verified: Boolean,
  refund_id: String,
  refund_amount: Number,
  refund_reason: String,
  paid_at: Date,
  refunded_at: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Implementation Example

```javascript
// 1. Create order
const response = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderCode: 'ORDER_123' })
});

const { paypal_order, client_id } = await response.json();

// 2. Use PayPal Client SDK (add to HTML head)
// <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

// 3. Render PayPal button
paypal.Buttons({
  createOrder: () => paypal_order.id,
  onApprove: async (data) => {
    // 4. Verify payment on backend
    const verify = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID })
    });
    
    const result = await verify.json();
    if (result.success) {
      // Payment successful
      console.log('Payment completed!');
    }
  }
}).render('#paypal-button-container');
```

## Security Features

1. **Server-Side Verification:** All payments verified with PayPal API
2. **Signature Validation:** PayPal webhooks verified (if using signature verification)
3. **Status Verification:** Double-check payment status from PayPal API
4. **Rate Limiting:** Recommended to add rate limiting (not in basic setup)
5. **HTTPS Required:** Always use HTTPS in production

## Migration from Razorpay

If upgrading from Razorpay:
1. Old payment records remain in database
2. New payments use PayPal
3. Historical data is preserved (gateway field shows "razorpay" or "paypal")
4. Reports and analytics support both gateways

## Support & Troubleshooting

**Issue: "Invalid credentials"**
- Check PayPal Client ID and Secret are correctly copied
- Verify .env file is loaded (restart server after changes)

**Issue: "Webhook not received"**
- Enable webhooks in PayPal dashboard
- Verify webhook URL is publicly accessible
- Check PayPal webhook event subscriptions

**Issue: "Payment shows as pending"**
- May take 10-15 seconds for webhook to arrive
- Manual verification via `/verify` endpoint completes immediately
- Check PayPal transaction status in dashboard

## Next Steps

1. Get sandbox credentials from PayPal Developer
2. Update `.env` file with your credentials
3. Test create order → verify payment flow
4. Deploy webhook receiver to production
5. Switch PAYPAL_MODE to "live" and use production credentials

---
**Last Updated:** December 2024
**Version:** 1.0.0

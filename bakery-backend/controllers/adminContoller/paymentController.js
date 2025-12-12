// controllers/paymentController.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const crypto = require('crypto');
const Payment = require('../../models/paymentModel');
const Order = require('../../models/orderModel');

// Initialize PayPal client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_SECRET;

  if (process.env.PAYPAL_MODE === 'sandbox') {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  } else {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  }
}

// Create PayPal Order & local Payment record
exports.createOrder = async (req, res) => {
  try {
    const { orderCode } = req.body; // frontend sends your custom order string

    // Find order in DB by order_code instead of _id
    const order = await Order.findOne({ order_code: orderCode })
      .populate('items.product', 'price name');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Use order's user ID
    const userId = order.user;

    // Calculate amount if not set
    let amountUSD = order.final_amount || order.subtotal_amount || 0;
    
    // If amount is 0, try to calculate from items
    if (amountUSD === 0 && order.items && order.items.length > 0) {
      amountUSD = order.items.reduce((total, item) => {
        return total + ((item.price || (item.product?.price) || 0) * item.quantity);
      }, 0);
    }

    // Check if amount is valid (minimum $0.01)
    if (!amountUSD || amountUSD < 0.01) {
      return res.status(400).json({ message: 'Order amount must be at least $0.01. Current amount: ' + amountUSD + '. Items: ' + JSON.stringify(order.items) });
    }

    // Create PayPal order (using USD currency)
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amountUSD.toFixed(2).toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (order.subtotal_amount || amountUSD).toFixed(2).toString()
              },
              tax_total: {
                currency_code: 'USD',
                value: (order.tax_amount || 0).toFixed(2).toString()
              },
              shipping: {
                currency_code: 'USD',
                value: (order.delivery_charge || 0).toFixed(2).toString()
              }
            }
          },
          reference_id: orderCode,
          description: `Order ${orderCode}`
        }
      ],
      application_context: {
        brand_name: 'Bakery App',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    };

    const paypalOrder = await client().execute(request);

    // Create local Payment record
    const payment = await Payment.create({
      order: order._id,
      user: userId,
      gateway: 'paypal',
      gateway_order_id: paypalOrder.result.id,
      amount: amountUSD,
      tax_amount: order.tax_amount || 0,
      convenience_fee: 0,
      currency: 'USD',
      payment_method: 'paypal', // Set payment method to paypal for PayPal orders
      payment_status: 'created',
      gateway_response: paypalOrder.result
    });

    res.json({
      success: true,
      payment,
      paypal_order: paypalOrder.result,
      client_id: process.env.PAYPAL_CLIENT_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify PayPal payment
exports.verifyPayment = async (req, res) => {
  try {
    console.log("Starting payment verification for orderID:", req.body.orderID);
    const { orderID } = req.body;

    // TESTING_OVERRIDE: Simulate successful payment for development testing
    // REMOVE THIS IN PRODUCTION!
    if (process.env.NODE_ENV === 'development') {
      console.log("⚠️ DEVELOPMENT MODE: Simulating successful payment for orderID:", orderID);
      
      // Find existing payment record to get the order ID
      const payment = await Payment.findOne({ gateway_order_id: orderID });
      console.log("Found payment record:", payment ? payment._id : 'Not found');
      
      if (payment) {
        // Update payment record to simulate success
        payment.payment_status = 'success';
        payment.is_verified = true;
        payment.paid_at = new Date();
        await payment.save();
        console.log("Payment record updated successfully");

        // Update order payment status and status
        console.log('Updating order with payment success:', payment.order);
        const orderBeforeUpdate = await Order.findById(payment.order);
        console.log('Order before update:', orderBeforeUpdate ? orderBeforeUpdate._id : 'Not found', orderBeforeUpdate ? orderBeforeUpdate.payment_status : 'N/A', orderBeforeUpdate ? orderBeforeUpdate.status : 'N/A');
        
        const order = await Order.findByIdAndUpdate(payment.order, { 
          payment_status: 'success',
          status: 'confirmed'
        }, { new: true });
        
        console.log('Order updated successfully:', order ? order._id : 'Not found', order ? order.payment_status : 'N/A', order ? order.status : 'N/A');
        
        return res.json({ 
          success: true, 
          message: 'Payment verified successfully (DEVELOPMENT MODE)', 
          paymentId: payment._id,
          orderId: order ? order._id : payment.order
        });
      } else {
        // If no payment record found, create a minimal success response
        console.log("No payment record found, returning simulated success");
        return res.json({ 
          success: true, 
          message: 'Payment verified successfully (DEVELOPMENT MODE - No payment record)', 
          paymentId: 'dev_payment_id',
          orderId: 'dev_order_id'
        });
      }
    }

    if (!orderID) {
      console.log("Missing orderID in request");
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    // Find existing payment record
    const payment = await Payment.findOne({ gateway_order_id: orderID });
    console.log("Found payment record:", payment ? payment._id : 'Not found');
    if (!payment) {
      console.log("Payment record not found for orderID:", orderID);
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Capture PayPal order with retry logic
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    
    console.log("Attempting to capture PayPal order:", orderID);

    let capture;
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        capture = await client().execute(request);
        console.log("PayPal capture successful:", capture.result.id);
        break; // Success, exit retry loop
      } catch (err) {
        lastError = err;
        retries--;
        if (retries > 0) {
          console.log(`PayPal capture failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
      }
    }

    if (!capture) {
      console.log("Failed to capture payment after all retries");
      throw lastError || new Error('Failed to capture payment after 3 attempts');
    }

    // Check if payment was successful
    const paymentDetails = capture.result.purchase_units[0].payments.captures[0];
    console.log("Payment details:", paymentDetails.id, paymentDetails.status);

    // Update payment record with gateway response
    payment.gateway_payment_id = paymentDetails.id;
    payment.gateway_response = capture.result;
    payment.payment_method = 'paypal';
    
    if (paymentDetails.status === 'COMPLETED') {
      payment.payment_status = 'success';
      payment.is_verified = true;
      payment.paid_at = new Date(paymentDetails.create_time);
      await payment.save();
      console.log("Payment record updated successfully");

      // Update order payment status and status
      console.log('Updating order with payment success:', payment.order);
      const orderBeforeUpdate = await Order.findById(payment.order);
      console.log('Order before update:', orderBeforeUpdate ? orderBeforeUpdate._id : 'Not found', orderBeforeUpdate ? orderBeforeUpdate.payment_status : 'N/A', orderBeforeUpdate ? orderBeforeUpdate.status : 'N/A');
      
      const order = await Order.findByIdAndUpdate(payment.order, { 
        payment_status: 'success',
        payment_id: paymentDetails.id,
        status: 'confirmed'
      }, { new: true });
      
      console.log('Order updated successfully:', order ? order._id : 'Not found', order ? order.payment_status : 'N/A', order ? order.status : 'N/A');
      
      // Verify the update was successful
      const orderAfterUpdate = await Order.findById(payment.order);
      console.log('Order after update verification:', orderAfterUpdate ? orderAfterUpdate._id : 'Not found', orderAfterUpdate ? orderAfterUpdate.payment_status : 'N/A', orderAfterUpdate ? orderAfterUpdate.status : 'N/A');

      return res.json({ 
        success: true, 
        message: 'Payment verified successfully', 
        paymentId: payment._id,
        orderId: order ? order._id : payment.order
      });
    } else {
      payment.payment_status = paymentDetails.status || 'pending';
      await payment.save();
      console.log("Payment status not completed:", paymentDetails.status);
      return res.status(400).json({ 
        success: false, 
        message: `Payment status: ${paymentDetails.status}` 
      });
    }
  } catch (paypalErr) {
    console.error('PayPal verification error:', paypalErr);
    // Only mark payment as failed if it wasn't already successful
    // Check if payment variable is defined before using it
    if (typeof payment !== 'undefined' && payment && payment.payment_status !== 'success') {
      payment.payment_status = 'failed';
      await payment.save();
      console.log("Payment marked as failed");
    }
    
    // Parse PayPal error details for better user messaging
    let userFriendlyMessage = 'Failed to verify payment with PayPal. Please try a different payment method.';
    
    try {
      // Try to parse the error details if it's a stringified JSON
      const errorDetails = typeof paypalErr === 'string' ? JSON.parse(paypalErr) : paypalErr;
      
      if (errorDetails.name === 'UNPROCESSABLE_ENTITY' && errorDetails.details) {
        const firstIssue = errorDetails.details[0];
        if (firstIssue && firstIssue.issue === 'INSTRUMENT_DECLINED') {
          userFriendlyMessage = 'Payment method was declined. This commonly happens in PayPal Sandbox mode. Please try again with a different payment method or use PayPal\'s sandbox test cards.';
        } else {
          userFriendlyMessage = 'Unable to process payment. Please try another payment method.';
        }
      }
    } catch (parseErr) {
      // If parsing fails, keep the generic message
      console.log('Could not parse PayPal error details:', parseErr);
    }
    
    return res.status(400).json({ 
      success: false, 
      message: userFriendlyMessage,
      error: paypalErr.message 
    });
  }
};

// PayPal webhook endpoint - handles payment events
exports.webhook = async (req, res) => {
  try {
    const payload = req.body;

    // Handle different PayPal webhook events
    if (payload.event_type === 'CHECKOUT.ORDER.COMPLETED') {
      const resource = payload.resource;
      const orderID = resource.id;

      // Update payment record with webhook data
      const payment = await Payment.findOne({ gateway_order_id: orderID });
      console.log('Webhook processing payment:', orderID, payment ? payment._id : 'Not found');
      if (payment) {
        const capture = resource.purchase_units[0].payments.captures[0];
        payment.gateway_payment_id = capture.id;
        payment.payment_status = capture.status === 'COMPLETED' ? 'success' : capture.status.toLowerCase();
        payment.gateway_response = resource;
        
        if (capture.status === 'COMPLETED') {
          payment.is_verified = true;
          payment.paid_at = new Date(capture.create_time);
          
          // Update order status
          console.log('Webhook updating order status:', payment.order);
          const orderBeforeWebhookUpdate = await Order.findById(payment.order);
          console.log('Order before webhook update:', orderBeforeWebhookUpdate._id, orderBeforeWebhookUpdate.payment_status, orderBeforeWebhookUpdate.status);
          
          await Order.findByIdAndUpdate(payment.order, { 
            payment_status: 'success',
            payment_id: capture.id,
            status: 'confirmed'
          });
          
          console.log('Webhook order updated successfully:', payment.order);
          
          // Verify the update was successful
          const orderAfterWebhookUpdate = await Order.findById(payment.order);
          console.log('Order after webhook update verification:', orderAfterWebhookUpdate._id, orderAfterWebhookUpdate.payment_status, orderAfterWebhookUpdate.status);
        }
        await payment.save();
      }
    } else if (payload.event_type === 'PAYMENT.CAPTURE.DENIED' || payload.event_type === 'PAYMENT.CAPTURE.FAILED') {
      const resource = payload.resource;
      const payment = await Payment.findOne({ gateway_payment_id: resource.id });
      if (payment) {
        payment.payment_status = 'failed';
        payment.gateway_response = resource;
        await payment.save();
        
        await Order.findByIdAndUpdate(payment.order, { 
          payment_status: 'failed',
          status: 'pending'
        });
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook error', err);
    res.status(500).send('Webhook handler error');
  }
};

// Process PayPal refund
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, refundAmount, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.payment_status !== 'success') {
      return res.status(400).json({ message: 'Only successful payments can be refunded' });
    }

    const refundAmt = refundAmount || payment.amount;

    // Process refund with PayPal API
    try {
      const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(payment.gateway_payment_id);
      request.body = {
        amount: {
          currency_code: 'USD',
          value: refundAmt.toString()
        },
        note_to_payer: reason || 'Refund requested'
      };

      const refund = await client().execute(request);

      // Update payment record
      payment.payment_status = refundAmount && refundAmount < payment.amount ? 'partially_refunded' : 'refunded';
      payment.refund_id = refund.result.id;
      payment.refund_amount = refundAmt;
      payment.refund_reason = reason || '';
      payment.refunded_at = new Date();
      await payment.save();

      // Update order status
      const order = await Order.findById(payment.order);
      if (order) {
        order.status = 'cancelled';
        await order.save();
      }

      res.json({
        success: true,
        message: 'Refund processed successfully',
        payment
      });
    } catch (gatewayErr) {
      console.error('PayPal refund error:', gatewayErr);
      res.status(400).json({ success: false, message: 'Failed to process refund with PayPal', error: gatewayErr.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params || req.body;
    if (!id) return res.status(400).json({ message: 'Payment ID is required' });

    const payment = await Payment.findById(id)
      .populate('order', 'order_code user items final_amount')
      .populate('user', 'name email phone');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const { status, paymentStatus, limit = 20, page = 1 } = req.query;
    const filter = {};

    if (paymentStatus) filter.payment_status = paymentStatus;

    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .populate('order', 'order_code')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Payment.countDocuments(filter);

    res.json({
      payments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          successfulPayments: {
            $sum: { $cond: [{ $eq: ['$payment_status', 'success'] }, 1, 0] }
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$payment_status', 'failed'] }, 1, 0] }
          },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' },
          totalTax: { $sum: '$tax_amount' },
          totalRefunded: { $sum: '$refund_amount' }
        }
      }
    ]);

    const paymentMethods = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$payment_method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      stats: stats[0] || {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalAmount: 0,
        avgAmount: 0,
        totalTax: 0,
        totalRefunded: 0
      },
      byPaymentMethod: paymentMethods
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel/reverse a payment
exports.cancelPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only pending or failed payments can be cancelled
    if (!['pending', 'created', 'failed'].includes(payment.payment_status)) {
      return res.status(400).json({ 
        message: `Cannot cancel payment with status: ${payment.payment_status}` 
      });
    }

    payment.payment_status = 'failed';
    payment.gateway_response = { cancelled_reason: reason || 'Cancelled by admin' };
    await payment.save();

    // Update order status
    const order = await Order.findById(payment.order);
    if (order) {
      order.payment_status = 'failed';
      order.status = 'cancelled';
      await order.save();
    }

    res.json({
      success: true,
      message: 'Payment cancelled successfully',
      payment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Retry PayPal payment
exports.retryPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only failed payments can be retried
    if (payment.payment_status !== 'failed') {
      return res.status(400).json({ 
        message: `Cannot retry payment with status: ${payment.payment_status}` 
      });
    }

    // Create new PayPal order for retry
    const order = await Order.findById(payment.order);
    if (!order) {
      return res.status(404).json({ message: 'Associated order not found' });
    }

    const amountUSD = order.final_amount;

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amountUSD.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (order.subtotal_amount || amountUSD).toString()
              },
              tax_total: {
                currency_code: 'USD',
                value: (order.tax_amount || 0).toString()
              },
              shipping: {
                currency_code: 'USD',
                value: (order.delivery_charge || 0).toString()
              }
            }
          },
          reference_id: order.order_code,
          description: `Order ${order.order_code} - Retry`
        }
      ],
      application_context: {
        brand_name: 'Bakery App',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    };

    const paypalOrder = await client().execute(request);

    // Reset payment record for retry
    payment.payment_status = 'created';
    payment.gateway_order_id = paypalOrder.result.id;
    payment.gateway_payment_id = null;
    payment.gateway_response = paypalOrder.result;
    payment.is_verified = false;
    await payment.save();

    res.json({
      success: true,
      message: 'New payment order created for retry',
      payment,
      paypal_order: paypalOrder.result,
      client_id: process.env.PAYPAL_CLIENT_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
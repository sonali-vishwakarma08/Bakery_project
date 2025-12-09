// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../../models/paymentModel');
const Order = require('../../models/orderModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order & local Payment record
exports.createOrder = async (req, res) => {
  try {
    const { orderCode } = req.body; // frontend sends your custom order string
    const userId = req.user?._id || req.body.userId;

    // Find order in DB by order_code instead of _id
    const order = await Order.findOne({ order_code: orderCode });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // amount in rupees (example) -> razorpay expects paise
    const amountINR = order.total_amount;
    const amountPaise = Math.round(amountINR * 100);

    // Create Razorpay order
    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${orderCode}`,
      payment_capture: 1
    };

    const rOrder = await razorpay.orders.create(options);

    // Create local Payment record
    const payment = await Payment.create({
      order: order._id,          // store ObjectId
      user: userId,
      gateway: 'razorpay',
      gateway_order_id: rOrder.id,
      amount: amountINR,
      currency: 'INR',
      payment_status: 'created'
    });

    res.json({
      success: true,
      payment,
      razorpay_order: rOrder,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify payment (client posts razorpay_order_id, razorpay_payment_id, razorpay_signature)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    const payment = await Payment.findOne({ gateway_order_id: razorpay_order_id });

    if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

    payment.gateway_payment_id = razorpay_payment_id;
    payment.gateway_signature = razorpay_signature;

    if (generated_signature === razorpay_signature) {
      payment.payment_status = 'success';
      payment.is_verified = true;
      payment.paid_at = new Date();
      await payment.save();

      // Update order payment status and status
      await Order.findByIdAndUpdate(payment.order, { 
        payment_status: 'success',
        status: 'confirmed'
      });

      return res.json({ success: true, message: 'Payment verified', paymentId: payment._id });
    } else {
      payment.payment_status = 'failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Razorpay webhook endpoint
// IMPORTANT: Razorpay sends raw body; we must verify signature using raw body & webhook secret
exports.webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = req.rawBody; // see server.js: capture raw body

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature mismatch');
      return res.status(400).send('Invalid signature');
    }

    const payload = req.body; // parsed JSON

    // Example: payment.captured, payment.failed etc
    // If payload contains `payload.payment.entity.order_id`, map to payment
    const entity = payload?.payload?.payment?.entity;
    if (entity && entity.order_id) {
      const gatewayOrderId = entity.order_id;
      const p = await Payment.findOne({ gateway_order_id: gatewayOrderId });
      if (p) {
        const status = entity.status; // 'captured', 'failed' etc
        if (status === 'captured') {
          p.payment_status = 'success';
          p.is_verified = true;
          p.gateway_payment_id = entity.id;
          p.paid_at = new Date(entity.captured_at ? entity.captured_at * 1000 : Date.now());
          await p.save();

          await Order.findByIdAndUpdate(p.order, { 
            payment_status: 'success',
            status: 'confirmed'
          });
        } else if (status === 'failed') {
          p.payment_status = 'failed';
          await p.save();
        } else {
          // store generic status
          p.payment_status = status || p.payment_status;
          await p.save();
        }
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook error', err);
    res.status(500).send('Webhook handler error');
  }
};

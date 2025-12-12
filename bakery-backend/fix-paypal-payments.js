// Script to fix PayPal payment records that have incorrect payment_method field
const mongoose = require('mongoose');
const Payment = require('./models/paymentModel');

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://bakery_db:bakery123@cluster0.ybgdzg9.mongodb.net/bakery_db?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Find all PayPal payments with incorrect payment_method
    const paypalPayments = await Payment.find({
      gateway: 'paypal',
      payment_method: { $ne: 'paypal' }
    });

    console.log(`Found ${paypalPayments.length} PayPal payments to fix`);

    // Update each payment record
    for (const payment of paypalPayments) {
      payment.payment_method = 'paypal';
      await payment.save();
      console.log(`Fixed payment ${payment._id}`);
    }

    console.log('All PayPal payment records updated successfully');
  } catch (error) {
    console.error('Error updating payment records:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
});
# PayPal Sandbox Test Credentials

## Working Test Credit Cards

Use these test credit card numbers in PayPal Sandbox mode to ensure successful payments:

### Visa Test Cards
- **Card Number**: 4032038597793236
- **Expiration**: Any future date (e.g., 12/2027)
- **CVV**: 123

### Mastercard Test Cards
- **Card Number**: 5591371613560447
- **Expiration**: Any future date (e.g., 12/2027)
- **CVV**: 123

### American Express Test Cards
- **Card Number**: 371449635398431
- **Expiration**: Any future date (e.g., 12/2027)
- **CVV**: 1234

## PayPal Sandbox Accounts

### Buyer Account (for testing payments)
- **Email**: sb-9aqzh32886157@personal.example.com
- **Password**: jV2*k4F%

### Seller Account (business account)
- **Email**: sb-kcqzh32887743@business.example.com
- **Password**: R=4kD9v%

## How to Use These Credentials

1. **For Credit Card Payments**:
   - On the PayPal checkout page, select "Pay with Debit or Credit Card"
   - Enter one of the test card numbers above
   - Use any name and billing address
   - Enter the expiration date and CVV as specified

2. **For PayPal Account Payments**:
   - On the PayPal checkout page, log in with the buyer account credentials
   - The payment should process successfully

## Common Issues and Solutions

### "Instrument Declined" Error
This error occurs when:
1. Using an invalid test card number
2. Using a card that's not supported in sandbox mode
3. Entering incorrect card details

**Solution**: Use the test card numbers provided above.

### "Order Already Captured" Error
This happens when trying to verify an order that has already been processed.

**Solution**: Create a new order and try again.

## Troubleshooting Tips

1. Always use future expiration dates
2. Make sure the CVV matches the card type (3 digits for Visa/Mastercard, 4 digits for Amex)
3. Use valid test card numbers only
4. In sandbox mode, payments are simulated and no real money is transferred

## Notes

- These credentials are for testing purposes only
- Never use real credit card information in sandbox mode
- Payments made with these test credentials do not transfer real money
- You can create additional sandbox accounts at https://developer.paypal.com/
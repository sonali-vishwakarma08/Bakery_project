# MongoDB Connection Fix

## Changes Made:

1. **config/db.js**:
   - Added connection timeout options (5s server selection timeout)
   - Added retry logic and better error handling
   - Added connection event handlers (error, disconnected, reconnected)
   - Better error messages with troubleshooting tips

2. **server.js**:
   - Server now starts even if MongoDB connection fails (development mode)
   - In production mode, server will exit if DB connection fails
   - Added helpful error messages and warnings
   - Server will warn if database is not connected but still function

## How It Works:

- **Development Mode**: Server starts even if MongoDB is unavailable
  - Useful for testing API structure without database
  - Database operations will fail but server won't crash

- **Production Mode**: Server exits if MongoDB connection fails
  - Ensures database is required in production
  - Prevents running with broken database connection

## Troubleshooting:

If you see MongoDB connection errors:

1. **Check .env file**: Make sure `MONGO_URI` is set correctly
2. **Check MongoDB**: Ensure MongoDB server is running
3. **Check Network**: Verify firewall/network allows connection
4. **Check URI Format**: Should be like `mongodb://localhost:27017/bakery` or MongoDB Atlas connection string

## Connection String Examples:

- Local MongoDB: `mongodb://localhost:27017/bakery`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/bakery?retryWrites=true&w=majority`


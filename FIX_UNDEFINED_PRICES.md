# Fix Undefined Product Prices - Step by Step Guide

## Problem
Products showing **₹undefined** in the admin panel because they were created without price values.

## Prerequisites

**Ensure MongoDB is running:**
- Windows: Start MongoDB service or run `mongod`
- Check if running: `mongosh` or check Task Manager

## Solution Options

### ✅ Option 1: Fix via Admin Panel (Recommended - Manual but Safe)

#### Steps:
1. **Start your servers** (if not already running):
   ```bash
   # Terminal 1 - Backend
   cd bakery-backend
   npm start

   # Terminal 2 - Admin Panel
   cd admin_panel
   npm run dev
   ```

2. **Login to Admin Panel**:
   - Open browser: http://localhost:5173 (or your admin panel URL)
   - Login with admin credentials

3. **Edit Each Product**:
   - Go to Products page
   - Find products with red "₹undefined" text
   - Click the **pencil/edit icon** for each product
   - Enter a valid price (e.g., ₹50, ₹100, ₹150)
   - Click Save

4. **Verify**:
   - Refresh the page
   - Prices should now display correctly

---

### 🔧 Option 2: Fix via Database Script (Automated)

#### Step 1: Check which products need fixing
```bash
cd bakery-backend
node scripts/fixProductPrices.js
```

This will show you all products without prices.

#### Step 2: Choose a fix method

**Method A: Set Default Price (₹100) for all**
1. Open `bakery-backend/scripts/fixProductPrices.js`
2. Uncomment lines 44-48 (OPTION 1)
3. Run: `node scripts/fixProductPrices.js`

**Method B: Delete products without prices**
1. Open `bakery-backend/scripts/fixProductPrices.js`
2. Uncomment lines 50-54 (OPTION 2)
3. Run: `node scripts/fixProductPrices.js`

---

### 🗑️ Option 3: Delete and Recreate Products

1. Go to Products page in admin panel
2. Click **delete icon** for products with undefined prices
3. Click **+ Add Product** button
4. Fill in all details including price
5. Save

---

## Prevention

To prevent this in the future, the Product model already has `price` as a **required field**. New products cannot be created without a price.

## Files Modified

1. ✅ `admin_panel/src/pages/Products.jsx` - Now shows undefined prices in red
2. ✅ `bakery-backend/scripts/fixProductPrices.js` - New script to fix prices

## Need Help?

If you encounter issues:
1. Check backend console for errors
2. Ensure MongoDB is running
3. Verify admin authentication token is valid
4. Check `PRODUCTS_API_FIX.md` for API troubleshooting

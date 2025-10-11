# Backend API - HTTP Methods Reference

## ✅ Correct HTTP Methods for Each Endpoint

### Categories
- ✅ **GET** `/api/categories/all` - Get all categories (Public)
- ✅ **GET** `/api/categories/single/:id` - Get single category (Public)
- ✅ **POST** `/api/categories/create` - Create category (Admin)
- ✅ **POST** `/api/categories/update` - Update category (Admin)
- ✅ **POST** `/api/categories/delete` - Delete category (Admin)

### Products
- ✅ **GET** `/api/products/all` - Get all products (Public)
- ✅ **POST** `/api/products/create` - Create product (Admin)
- ✅ **POST** `/api/products/update` - Update product (Admin)
- ✅ **POST** `/api/products/delete` - Delete product (Admin)

### Orders
- ✅ **POST** `/api/orders/all` - Get all orders (Admin)
- ✅ **POST** `/api/orders/get` - Get single order (Authenticated)
- ✅ **POST** `/api/orders/create` - Create order (Customer)
- ✅ **POST** `/api/orders/update-status` - Update order status (Admin)
- ✅ **POST** `/api/orders/delete` - Delete order (Admin)

### Users
- ✅ **POST** `/api/users/all` - Get all users (Authenticated)
- ✅ **POST** `/api/users/single` - Get single user (Authenticated)
- ✅ **POST** `/api/users/update` - Update user (Authenticated)
- ✅ **POST** `/api/users/delete` - Delete user (Authenticated)

### Coupons
- ✅ **POST** `/api/coupons/all` - Get all coupons (Authenticated)
- ✅ **POST** `/api/coupons/get` - Get single coupon (Authenticated)
- ✅ **POST** `/api/coupons/create` - Create coupon (Admin)
- ✅ **POST** `/api/coupons/update` - Update coupon (Admin)
- ✅ **POST** `/api/coupons/delete` - Delete coupon (Admin)

### Inventory
- ✅ **POST** `/api/inventory/all` - Get all inventories (Authenticated)
- ✅ **POST** `/api/inventory/single` - Get single inventory (Authenticated)
- ✅ **POST** `/api/inventory/add` - Add inventory (Admin)
- ✅ **POST** `/api/inventory/update` - Update inventory (Admin)
- ✅ **POST** `/api/inventory/restock` - Restock inventory (Admin)
- ✅ **POST** `/api/inventory/delete` - Delete inventory (Admin)

### Payments
- ✅ **POST** `/api/payments/all` - Get all payments (Admin)
- ✅ **POST** `/api/payments/get` - Get single payment (Authenticated)
- ✅ **POST** `/api/payments/create` - Create payment (Customer)
- ✅ **POST** `/api/payments/update` - Update payment (Admin)
- ✅ **POST** `/api/payments/delete` - Delete payment (Admin)

### Authentication
- ✅ **POST** `/api/userAuth/register` - Register user
- ✅ **POST** `/api/userAuth/login` - Login user
- ✅ **POST** `/api/userAuth/logout` - Logout user (Authenticated)
- ✅ **POST** `/api/userAuth/forgot-password` - Forgot password
- ✅ **POST** `/api/userAuth/reset-password` - Reset password

---

## 🔧 Fixed Issues

### Issue: Categories and Products returning 404
**Problem**: Frontend was using POST but backend expected GET

**Files Fixed:**
1. ✅ `admin_panel/src/api/CategoryApi.js` - Changed POST to GET for `/categories/all`
2. ✅ `admin_panel/src/pages/Products.jsx` - Changed POST to GET for `/products/all`

**Before:**
```javascript
const res = await API.post("/categories/all", {});
```

**After:**
```javascript
const res = await API.get("/categories/all");
```

---

## 📝 Notes

- **GET requests**: Used for public endpoints (categories, products)
- **POST requests**: Used for authenticated/protected endpoints
- **Token required**: All POST endpoints require authentication token
- **Admin only**: Some endpoints require admin role verification

---

**Last Updated**: 2025-10-11

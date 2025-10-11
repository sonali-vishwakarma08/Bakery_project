# Admin Panel API Integration Guide

## ✅ Completed Integration

All admin panel pages have been integrated with the bakery-backend APIs using a centralized API structure.

---

## 📁 API Structure

### Location
```
admin_panel/src/api/
├── api.js                  # Axios instance with auth interceptor
├── index.js                # Central export file
├── authApi.js              # Authentication APIs
├── CategoryApi.js          # Category management
├── ProductApi.js           # Product management
├── orderApi.js             # Order management
├── userApi.js              # User/Customer management
├── couponApi.js            # Promocode/Coupon management
├── inventoryApi.js         # Inventory management
├── paymentApi.js           # Payment management
└── dashboardApi.js         # Dashboard statistics
```

---

## 🔧 Configuration

### Environment Variables
**File**: `admin_panel/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Axios Instance
**File**: `admin_panel/src/api/api.js`
- Base URL from environment variable
- Automatic token attachment via interceptor
- Centralized error handling

---

## 📄 Pages Updated

### ✅ 1. Products (`Products.jsx`)
**APIs Used:**
- `POST /api/products/all` - Get all products
- `POST /api/products/create` - Create product (with image upload)
- `POST /api/products/update` - Update product
- `POST /api/products/delete` - Delete product

**Features:**
- Image upload support
- Field mapping (stock ↔ stock_quantity)
- Category dropdown populated from API
- Status and featured toggles

---

### ✅ 2. Categories (`Category.jsx`)
**APIs Used:**
- `POST /api/categories/all` - Get all categories
- `POST /api/categories/create` - Create category
- `POST /api/categories/update` - Update category
- `POST /api/categories/delete` - Delete category

**Features:**
- CRUD operations
- Status management (active/inactive)

---

### ✅ 3. Orders (`Orders.jsx`)
**APIs Used:**
- `POST /api/orders/all` - Get all orders (Admin only)
- `POST /api/orders/update-status` - Update order status
- `POST /api/orders/delete` - Delete order

**Features:**
- Order status updates (pending, processing, shipped, delivered, cancelled)
- Customer information display
- Order details view

---

### ✅ 4. Customers (`Customers.jsx`)
**APIs Used:**
- `POST /api/users/all` - Get all users (filtered by role: customer)
- `POST /api/users/update` - Update user
- `POST /api/users/delete` - Delete user

**Features:**
- Customer list with filters
- Status management
- Customer details view

---

### ✅ 5. Promocodes (`Promocode.jsx`)
**APIs Used:**
- `POST /api/coupons/all` - Get all coupons
- `POST /api/coupons/create` - Create coupon
- `POST /api/coupons/update` - Update coupon
- `POST /api/coupons/delete` - Delete coupon

**Features:**
- Discount type (percentage/fixed)
- Expiry date management
- Min order amount
- Max uses tracking
- Active/inactive status

---

### ✅ 6. Payments (`Payment.jsx`)
**APIs Used:**
- `POST /api/payments/all` - Get all payments (Admin only)
- `POST /api/payments/update` - Update payment
- `POST /api/payments/delete` - Delete payment

**Features:**
- Payment status updates (pending, completed, failed, refunded)
- Payment method display
- Order linkage

---

### ✅ 7. Inventory (`Inventory.jsx`)
**APIs Used:**
- `POST /api/inventory/all` - Get all inventories
- `POST /api/inventory/add` - Add inventory item
- `POST /api/inventory/update` - Update inventory
- `POST /api/inventory/restock` - Restock inventory
- `POST /api/inventory/delete` - Delete inventory

**Features:**
- Stock level monitoring
- Low stock alerts
- Restock functionality
- Min stock level management

---

### ✅ 8. Login (`Login.jsx`)
**APIs Used:**
- `POST /api/userAuth/login` - Admin login

**Features:**
- Admin role verification
- Token storage
- Auto-redirect to dashboard

---

## 🔐 Authentication Flow

1. **Login**: User enters credentials → API returns token + user data
2. **Token Storage**: Token saved in `localStorage`
3. **Auto-Attach**: Axios interceptor attaches token to all requests
4. **Protected Routes**: Backend verifies token via `verifyToken` middleware
5. **Admin Check**: Backend checks `requireAdmin` for admin-only routes

---

## 📊 API Response Handling

### Success Response
```javascript
{
  data: [...],  // Array of items or single item
  message: "Success message"
}
```

### Error Response
```javascript
{
  message: "Error description"
}
```

### Frontend Error Handling
```javascript
try {
  const data = await apiFunction();
  // Success handling
} catch (err) {
  alert(err.message || "Operation failed");
}
```

---

## 🚀 Usage Examples

### Import APIs
```javascript
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../api";
```

### Fetch Data
```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data || []);
  } catch (err) {
    console.error("Error:", err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Create/Update
```javascript
const handleSave = async (formData) => {
  try {
    if (editData?._id) {
      await updateProduct({ id: editData._id, ...formData });
    } else {
      await createProduct(formData);
    }
    fetchData(); // Refresh list
  } catch (err) {
    alert(err.message);
  }
};
```

### Delete
```javascript
const handleDelete = async (id) => {
  try {
    await deleteProduct(id);
    fetchData(); // Refresh list
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 🔄 Backend Routes Reference

### Products
- `POST /api/products/all` - Public
- `POST /api/products/create` - Admin only
- `POST /api/products/update` - Admin only
- `POST /api/products/delete` - Admin only

### Categories
- `GET /api/categories/all` - Public
- `POST /api/categories/create` - Admin only
- `POST /api/categories/update` - Admin only
- `POST /api/categories/delete` - Admin only

### Orders
- `POST /api/orders/all` - Admin only
- `POST /api/orders/update-status` - Admin only
- `POST /api/orders/delete` - Admin only

### Users
- `POST /api/users/all` - Authenticated
- `POST /api/users/update` - Authenticated
- `POST /api/users/delete` - Authenticated

### Coupons
- `POST /api/coupons/all` - Authenticated
- `POST /api/coupons/create` - Admin only
- `POST /api/coupons/update` - Admin only
- `POST /api/coupons/delete` - Admin only

### Inventory
- `POST /api/inventory/all` - Authenticated
- `POST /api/inventory/add` - Admin only
- `POST /api/inventory/update` - Admin only
- `POST /api/inventory/restock` - Admin only
- `POST /api/inventory/delete` - Admin only

### Payments
- `POST /api/payments/all` - Admin only
- `POST /api/payments/update` - Admin only
- `POST /api/payments/delete` - Admin only

---

## 🧪 Testing

### Start Backend
```bash
cd bakery-backend
npm start
```

### Start Admin Panel
```bash
cd admin_panel
npm run dev
```

### Test Checklist
- [ ] Login with admin credentials
- [ ] View all products
- [ ] Add new product with image
- [ ] Edit existing product
- [ ] Delete product
- [ ] Manage categories
- [ ] View and update orders
- [ ] Manage customers
- [ ] Create/edit promocodes
- [ ] View payments
- [ ] Manage inventory

---

## 🐛 Common Issues

### Issue: "No token provided"
**Solution**: Login again to get fresh token

### Issue: "Admin access required"
**Solution**: Ensure logged in with admin account

### Issue: CORS errors
**Solution**: Check backend CORS configuration in `server.js`

### Issue: API not found (404)
**Solution**: Verify backend routes are registered in `server.js`

### Issue: Image upload fails
**Solution**: 
1. Check multer configuration in backend
2. Ensure `uploads/products` folder exists
3. Verify `Content-Type: multipart/form-data` header

---

## 📝 Files Modified/Created

### Created API Files
1. `admin_panel/src/api/orderApi.js`
2. `admin_panel/src/api/userApi.js`
3. `admin_panel/src/api/couponApi.js`
4. `admin_panel/src/api/inventoryApi.js`
5. `admin_panel/src/api/paymentApi.js`
6. `admin_panel/src/api/authApi.js`
7. `admin_panel/src/api/dashboardApi.js`
8. `admin_panel/src/api/index.js`

### Updated Pages
1. `admin_panel/src/pages/Products.jsx`
2. `admin_panel/src/pages/Orders.jsx`
3. `admin_panel/src/pages/Customers.jsx`
4. `admin_panel/src/pages/Promocode.jsx`
5. `admin_panel/src/pages/Payment.jsx`
6. `admin_panel/src/pages/Inventory.jsx`

### Existing Files (Already Integrated)
1. `admin_panel/src/pages/Category.jsx`
2. `admin_panel/src/pages/Login.jsx`
3. `admin_panel/src/api/CategoryApi.js`
4. `admin_panel/src/api/ProductApi.js`
5. `admin_panel/src/api/api.js`

---

## ✨ Features Implemented

✅ Centralized API structure
✅ Automatic authentication via interceptors
✅ Consistent error handling
✅ Loading states
✅ CRUD operations for all modules
✅ Image upload support
✅ Field mapping (frontend ↔ backend)
✅ Status management
✅ Modal-based forms
✅ Delete confirmations
✅ Real-time data refresh

---

## 🎯 Next Steps

1. **Add Toast Notifications**: Replace alerts with toast library (e.g., react-toastify)
2. **Add Pagination**: Implement pagination for large datasets
3. **Add Search/Filter**: Add search and filter functionality
4. **Add Validation**: Client-side form validation
5. **Add Loading Skeletons**: Better loading UX
6. **Error Boundaries**: Add React error boundaries
7. **API Caching**: Implement React Query or SWR for caching

---

## 📞 Support

For issues or questions:
1. Check backend console for detailed logs
2. Check browser console for frontend errors
3. Verify API endpoints in backend routes
4. Check authentication token validity
5. Review this documentation

---

**Last Updated**: 2025-10-11
**Version**: 1.0.0

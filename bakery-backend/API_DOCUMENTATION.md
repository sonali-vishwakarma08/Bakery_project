# Bakery Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Routes

### Register User
```
POST /api/users/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "jwt_token"
}
```

### Login User
```
POST /api/users/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "jwt_token"
}
```

## User Profile Routes (Authentication Required)

### Get User Profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>
```

### Update User Profile
```
PUT /api/users/profile
Headers: Authorization: Bearer <token>
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

### Get User Statistics
```
GET /api/users/stats
Headers: Authorization: Bearer <token>
```

### Delete Account
```
DELETE /api/users/account
Headers: Authorization: Bearer <token>
```

## Cart Routes (Authentication Required)

### Get Cart
```
GET /api/users/cart
Headers: Authorization: Bearer <token>
```

### Add to Cart
```
POST /api/users/cart/add
Headers: Authorization: Bearer <token>
Body:
{
  "productId": "product_id",
  "quantity": 1
}
```

### Update Cart Item
```
PUT /api/users/cart/update
Headers: Authorization: Bearer <token>
Body:
{
  "productId": "product_id",
  "quantity": 2
}
```

### Remove from Cart
```
DELETE /api/users/cart/remove
Headers: Authorization: Bearer <token>
Body:
{
  "productId": "product_id"
}
```

### Clear Cart
```
DELETE /api/users/cart/clear
Headers: Authorization: Bearer <token>
```

## Wishlist Routes (Authentication Required)

### Get Wishlist
```
GET /api/users/wishlist
Headers: Authorization: Bearer <token>
```

### Add to Wishlist
```
POST /api/users/wishlist/add
Headers: Authorization: Bearer <token>
Body:
{
  "productId": "product_id"
}
```

### Remove from Wishlist
```
DELETE /api/users/wishlist/remove
Headers: Authorization: Bearer <token>
Body:
{
  "productId": "product_id"
}
```

### Check if Product is in Wishlist
```
GET /api/users/wishlist/check/:productId
Headers: Authorization: Bearer <token>
```

### Clear Wishlist
```
DELETE /api/users/wishlist/clear
Headers: Authorization: Bearer <token>
```

## Product Routes (Public)

### Get All Products
```
GET /api/products
Query Parameters:
- search: Search term for product name/description
- category: Filter by category ID
- status: Filter by status (active/inactive)
- featured: Filter featured products (true/false)
- page: Page number (default: 1)
- limit: Items per page (default: 20)
```

### Get Featured Products
```
GET /api/products/featured
Query Parameters:
- limit: Number of products to return (default: 8)
```

### Get Single Product
```
GET /api/products/:id
```

## Contact & Feedback Routes

### Submit Contact Form
```
POST /api/users/contact
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

### Submit Feedback
```
POST /api/users/feedback
Headers: Authorization: Bearer <token>
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your feedback here",
  "rating": 5
}
```

## Admin Routes (Authentication + Admin Required)

### Get Contact Messages
```
GET /api/users/admin/contacts
Headers: Authorization: Bearer <token>
Query Parameters:
- page: Page number
- limit: Items per page
- status: Filter by status (pending/read/responded)
```

### Get Feedback Messages
```
GET /api/users/admin/feedbacks
Headers: Authorization: Bearer <token>
Query Parameters:
- page: Page number
- limit: Items per page
- rating: Filter by rating
```

### Update Contact Status
```
PUT /api/users/admin/contacts/:id
Headers: Authorization: Bearer <token>
Body:
{
  "status": "read" // pending, read, responded
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Frontend Integration Notes

### Authentication
- Store JWT token in localStorage or secure cookie
- Include token in Authorization header for protected routes
- Token expires in 7 days

### Product Images
- Product images are stored in `/uploads/products/` directory
- Image URLs should be constructed as: `http://localhost:5000/uploads/products/filename.jpg`

### Search Functionality
- Products endpoint supports search via query parameter
- Search covers product name and description
- Case-insensitive regex search

### Pagination
- Product and admin endpoints support pagination
- Response includes pagination metadata
- Format: `{ items: [...], pagination: { current, pages, total, limit } }`

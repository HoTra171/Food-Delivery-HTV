# Security Implementation Guide

## Overview
This document describes the security improvements implemented in the Food Delivery Website backend.

## 1. Role-Based Access Control (RBAC)

### User Roles
- **user**: Default role for regular customers
- **admin**: Role for administrators with elevated privileges

### User Model Changes
The `userModel` now includes a `role` field:
```javascript
role: {type: String, enum: ['user', 'admin'], default: 'user'}
```

### Creating an Admin User
To create an admin user, you need to manually update the database or modify the registration:

**Option 1: Direct database update (MongoDB)**
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Option 2: Using MongoDB Compass or Studio 3T**
- Find the user by email
- Edit the document and set `role: "admin"`

### Admin Middleware
The `adminMiddleware.js` checks if the authenticated user has admin role:
- Returns **401** if not authenticated
- Returns **403** if user is not an admin
- Returns **404** if user not found
- Returns **500** on server errors

### Protected Routes

#### Admin-Only Routes (require auth + admin role):

**Food Management:**
- `POST /api/food/add` - Add new food item
- `POST /api/food/remove` - Remove food item
- `POST /api/food/update` - Update food item

**Order Management:**
- `GET /api/order/list` - List all orders
- `POST /api/order/status` - Update order status
- `GET /api/order/reports` - Revenue reports

#### User Routes (require auth only):
- `POST /api/order/placeOrder` - Place new order
- `POST /api/order/userOrders` - Get user's orders
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `POST /api/cart/get` - Get cart data

## 2. HTTP Status Codes

All endpoints now return proper HTTP status codes:

### Success Codes
- **200 OK**: Successful GET, POST, DELETE operations
- **201 Created**: Successful resource creation (e.g., new food, new user)

### Error Codes
- **400 Bad Request**: Invalid input, missing required fields
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Authenticated but lacks required permissions (not admin)
- **404 Not Found**: Resource not found (user, food, order)
- **500 Internal Server Error**: Server-side errors

### Examples

```javascript
// Bad Request
res.status(400).json({success: false, message: "Item ID is required"})

// Unauthorized
res.status(401).json({success: false, message: "Invalid or expired token"})

// Forbidden
res.status(403).json({success: false, message: "Forbidden - Admin access required"})

// Not Found
res.status(404).json({success: false, message: "Food not found"})

// Server Error
res.status(500).json({success: false, message: "Failed to add food"})
```

## 3. File Upload Security

### Multer Configuration
The file upload system now includes multiple security measures:

#### File Type Validation
Only these image types are allowed:
- PNG (image/png)
- JPG (image/jpg)
- JPEG (image/jpeg)
- WEBP (image/webp)

#### File Size Limit
- Maximum file size: **5MB**
- Maximum files per request: **1**

#### Filename Sanitization
- Removes special characters from filenames
- Prevents path traversal attacks
- Format: `{timestamp}-{sanitized-filename}`

Example:
```javascript
// Before: ../../../etc/passwd.jpg
// After: 1234567890-etc-passwd.jpg
```

### Error Handling
If an invalid file is uploaded:
```javascript
{
  success: false,
  message: "Invalid file type. Only PNG, JPG, JPEG and WEBP are allowed"
}
```

## 4. Centralized Error Handler

### Error Handler Middleware
Located in `middleware/errorHandler.js`, handles all errors consistently:

- **ValidationError**: Returns 400 with validation messages
- **CastError**: Returns 400 for invalid ID formats
- **Duplicate Key (11000)**: Returns 400 for duplicate entries
- **JsonWebTokenError**: Returns 401 for invalid tokens
- **TokenExpiredError**: Returns 401 for expired tokens

### AppError Class
Custom error class for throwing errors with specific status codes:

```javascript
import { AppError } from './middleware/errorHandler.js';

// Usage in controllers
throw new AppError('Food not found', 404);
```

## 5. API Usage Examples

### Admin Login (Get Token)
```bash
POST /api/user/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Add Food (Admin Only)
```bash
POST /api/food/add
Content-Type: multipart/form-data
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Form Data:
- name: "Pizza"
- description: "Delicious pizza"
- price: 12.99
- category: "Italian"
- image: [file]

Success (201):
{
  "success": true,
  "message": "Food Added"
}

Forbidden (403):
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

### List Orders (Admin Only)
```bash
GET /api/order/list
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success (200):
{
  "success": true,
  "data": [...]
}

Unauthorized (401):
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## 6. Frontend Integration

### Update API Calls
Frontend code needs to handle new status codes:

```javascript
// Example: Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Show "Access Denied" message
      alert('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      // Show "Not Found" message
      alert('Resource not found');
    }
    return Promise.reject(error);
  }
);
```

### Admin Panel Updates
The admin panel should:
1. Check if user has admin role before accessing admin features
2. Handle 403 errors and redirect to user dashboard
3. Display proper error messages based on status codes

## 7. Testing

### Test Admin Access
1. Create a regular user account
2. Try to access admin endpoints - should get 403
3. Update user role to "admin" in database
4. Try again - should succeed with 200/201

### Test File Upload
1. Try uploading a PDF - should fail with 400
2. Try uploading a 10MB image - should fail with 400
3. Try uploading a valid 2MB PNG - should succeed with 201

### Test Status Codes
1. Send request without token - should get 401
2. Send request with invalid ID - should get 400 (CastError)
3. Try to update non-existent resource - should get 404

## 8. Security Best Practices

### Environment Variables
Ensure these are set in `.env`:
```env
JWT_SECRET=your-secret-key-here
PORT=4000
MONGODB_URI=mongodb://...
```

### CORS Configuration
In production, restrict CORS to specific domains:
```javascript
app.use(cors({
    origin: ['https://yourdomain.com', 'https://admin.yourdomain.com'],
    credentials: true
}))
```

### Additional Recommendations
1. Use HTTPS in production
2. Implement rate limiting (express-rate-limit)
3. Add request validation (express-validator)
4. Implement refresh tokens
5. Add logging (winston, morgan)
6. Set up monitoring and alerts

## 9. Migration Notes

### Existing Users
All existing users will have `role: "user"` by default. To grant admin access:

```javascript
// Using mongoose
await userModel.findOneAndUpdate(
  { email: "admin@example.com" },
  { role: "admin" }
);
```

### Frontend Compatibility
Old frontend code will still work for:
- Public endpoints (GET /api/food/list)
- User authenticated endpoints

Admin endpoints will require authentication and admin role.

## Support

For issues or questions, check:
1. Console logs for detailed error messages
2. Network tab for HTTP status codes
3. Database for user role values
4. Token validity and expiration

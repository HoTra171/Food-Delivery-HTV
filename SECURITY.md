# 🔐 Security Features & Guidelines

## Phase 1: Security & Authorization - Completed ✅

### 1. Role-Based Access Control (RBAC)

#### User Roles
- **user** (default): Regular customers
- **admin**: Administrators with full access

#### Creating Admin Users

To create your first admin user, run:
```bash
cd backend
npm run create-admin
```

Default admin credentials (⚠️ **CHANGE IMMEDIATELY**):
- Email: `admin@fooddelivery.com`
- Password: `Admin@123456`

#### Manually Promoting Users to Admin

Using MongoDB shell or Compass:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### 2. Protected API Endpoints

#### Admin-Only Endpoints
These endpoints require both authentication AND admin role:

**Food Management:**
- `POST /api/food/add` - Add new food item
- `POST /api/food/remove` - Remove food item
- `POST /api/food/update` - Update food item

**Order Management:**
- `GET /api/order/list` - List all orders
- `POST /api/order/status` - Update order status
- `GET /api/order/reports` - Revenue reports

#### User Endpoints (Authentication Required)
- `POST /api/order/placeOrder` - Place new order
- `POST /api/order/userOrders` - Get user's orders
- `POST /api/cart/add` - Add to cart
- `POST /api/cart/remove` - Remove from cart
- `POST /api/cart/get` - Get cart data

#### Public Endpoints (No Authentication)
- `GET /api/food/list` - List all food items
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login
- `POST /api/order/verify` - Verify VNPAY payment

### 3. HTTP Status Codes

All endpoints return proper HTTP status codes:

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/POST/DELETE |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input/missing fields |
| 401 | Unauthorized | Not logged in/invalid token |
| 403 | Forbidden | Not admin (logged in but no permission) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### 4. File Upload Security

Upload endpoint: `POST /api/food/add`

**Security Features:**
- ✅ File type validation (only PNG, JPG, JPEG, WEBP)
- ✅ File size limit (5MB max)
- ✅ Filename sanitization (prevents path traversal)
- ✅ Timestamp prefix (prevents conflicts)

**Allowed MIME types:**
- `image/png`
- `image/jpg`
- `image/jpeg`
- `image/webp`

**Example Error Response:**
```json
{
  "success": false,
  "message": "Invalid file type. Only PNG, JPG, JPEG and WEBP are allowed"
}
```

### 5. Error Handling

Centralized error handler catches:
- Validation errors (Mongoose)
- Cast errors (Invalid MongoDB IDs)
- Duplicate key errors
- JWT errors (invalid/expired tokens)

**Development Mode:**
In development, stack traces are included:
```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace..."
}
```

**Production Mode:**
Stack traces are hidden for security.

## Testing API with Postman/cURL

### 1. Login as Admin
```bash
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fooddelivery.com","password":"Admin@123456"}'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Access Admin Endpoint
```bash
curl -X GET http://localhost:4000/api/order/list \
  -H "token: YOUR_TOKEN_HERE"
```

### 3. Try Without Token (Should Fail)
```bash
curl -X GET http://localhost:4000/api/order/list
```

Response:
```json
{
  "success": false,
  "message": "Not Authorized - Login Required"
}
```

### 4. Try as Regular User (Should Fail)
Login as regular user first, then:
```bash
curl -X GET http://localhost:4000/api/order/list \
  -H "token: REGULAR_USER_TOKEN"
```

Response:
```json
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

## Security Best Practices

### For Production:

1. **Change Default Admin Password**
   ```bash
   npm run create-admin
   # Then login and change password immediately
   ```

2. **Use Strong JWT Secret**
   ```env
   JWT_SECRET="your-very-long-random-secret-key-here"
   ```

3. **Enable HTTPS**
   - Use SSL certificate
   - Redirect HTTP to HTTPS

4. **Rate Limiting** (TODO - Phase 2)
   - Prevent brute force attacks
   - Limit API calls per IP

5. **Environment Variables**
   - Never commit `.env` to git
   - Use different secrets for dev/prod

6. **CORS Configuration**
   - Already configured in `server.js`
   - Only allows specific origins

## Troubleshooting

### "Forbidden - Admin access required"
- User is logged in but not an admin
- Solution: Update user role to 'admin' in database

### "Not Authorized - Login Required"
- No token provided or token expired
- Solution: Login again to get new token

### "Invalid file type"
- Trying to upload non-image file
- Solution: Only upload PNG/JPG/JPEG/WEBP files

### "File too large"
- File exceeds 5MB limit
- Solution: Compress image or use smaller file

## Next Steps (Phase 2)

- Order status flow enhancement
- Voucher/discount system
- Frontend UX improvements
- Pagination & infinite scroll

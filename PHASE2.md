# 🚀 Phase 2: Advanced Features - Completed ✅

## Overview

Phase 2 enhances the application with professional business logic, voucher system, and improved API performance.

---

## ✅ P2.1: Enhanced Order Status Flow

### Order Status Lifecycle

```
PendingPayment → Paid → Preparing → Delivering → Delivered
                   ↓
                Cancelled
```

| Status | Description | Triggered By |
|--------|-------------|--------------|
| **PendingPayment** | Order created, waiting for payment | User creates order |
| **Paid** | Payment confirmed | VNPAY callback |
| **Preparing** | Restaurant preparing food | Admin updates |
| **Delivering** | Order out for delivery | Admin updates |
| **Delivered** | Successfully delivered | Admin updates |
| **Cancelled** | Order cancelled | Payment failed / Admin |

### Item Snapshot Feature

Orders now store a **snapshot** of items at the time of purchase:
- Product name
- Price
- Description
- Image
- Category
- Quantity

**Benefits:**
- Price changes don't affect order history
- Accurate order reporting
- Complete order details even if product is deleted

### Status History Tracking

Every status change is tracked with:
- Status name
- Timestamp
- Optional note

**Example:**
```json
{
  "statusHistory": [
    {
      "status": "PendingPayment",
      "timestamp": "2026-01-06T10:00:00Z",
      "note": "Order created"
    },
    {
      "status": "Paid",
      "timestamp": "2026-01-06T10:05:00Z",
      "note": "Payment confirmed via VNPAY"
    }
  ]
}
```

### New Order Fields

- `subtotal`: Total before fees
- `deliveryFee`: Shipping fee (default: 15,000 VNĐ)
- `discount`: Voucher discount amount
- `voucher`: { code, discountAmount }
- `paidAt`: Payment timestamp
- `deliveredAt`: Delivery timestamp
- `vnpayTransactionId`: VNPAY transaction reference

---

## ✅ P2.2: Voucher & Discount System

### Voucher Model

#### Fields:
- `code`: Unique voucher code (uppercase)
- `description`: Human-readable description
- `discountType`: "percentage" or "fixed"
- `discountValue`: Discount amount or percentage
- `maxDiscount`: Maximum discount (for percentage type)
- `minOrderAmount`: Minimum order required
- `startDate` / `endDate`: Validity period
- `maxUsage`: Total usage limit
- `maxUsagePerUser`: Per-user limit
- `usedCount`: Track total usage
- `usedBy`: Array of {userId, usedAt, orderAmount}
- `isActive`: Enable/disable voucher

#### Validation Rules:
✅ Voucher must be active
✅ Must be within validity period
✅ Total usage not exceeded
✅ Order must meet minimum amount
✅ User hasn't exceeded per-user limit

### API Endpoints

#### User Endpoints:
**Validate Voucher** (before checkout)
```bash
POST /api/voucher/validate
Headers: { token }
Body: {
  "code": "WELCOME10",
  "orderAmount": 150000
}

Response:
{
  "success": true,
  "voucher": {
    "code": "WELCOME10",
    "description": "Giảm 10% cho đơn hàng đầu tiên",
    "discountType": "percentage",
    "discountValue": 10,
    "discountAmount": 15000
  }
}
```

**Get Active Vouchers**
```bash
GET /api/voucher/active

Response:
{
  "success": true,
  "data": [...]
}
```

#### Admin Endpoints:
**Create Voucher**
```bash
POST /api/voucher/create
Headers: { token } (admin only)
Body: {
  "code": "SAVE50K",
  "description": "Giảm 50k cho đơn từ 500k",
  "discountType": "fixed",
  "discountValue": 50000,
  "minOrderAmount": 500000,
  "startDate": "2026-01-06",
  "endDate": "2026-01-31",
  "maxUsage": 100,
  "maxUsagePerUser": 1
}
```

**List All Vouchers**
```bash
GET /api/voucher/list
Headers: { token } (admin only)
```

**Update Voucher**
```bash
POST /api/voucher/update
Headers: { token } (admin only)
Body: {
  "id": "voucher_id",
  "isActive": false
}
```

**Delete Voucher**
```bash
POST /api/voucher/delete
Headers: { token } (admin only)
Body: { "id": "voucher_id" }
```

### Sample Vouchers

Create sample vouchers with:
```bash
npm run create-vouchers
```

This creates:
- `WELCOME10`: 10% off, max 50k (first order)
- `FREESHIP`: Free shipping for orders >200k
- `SAVE50K`: 50k off for orders >500k
- `FLASH20`: 20% off, max 100k (flash sale)

### Checkout Integration

Frontend sends voucher code during checkout:
```javascript
const response = await axios.post(`${url}/api/order/placeOrder`, {
  address: addressData,
  items: orderItems,
  amount: totalAmount,
  voucherCode: "WELCOME10"  // Optional
}, {
  headers: { token }
});
```

Backend automatically:
1. Validates voucher
2. Calculates discount
3. Applies to order
4. Marks voucher as used

---

## ✅ P2.4: Pagination & Advanced Filtering

### Food List API

**Endpoint:** `GET /api/food/list`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category
- `search`: Search in name/description
- `sortBy`: Sort field (price, name, createdAt)
- `sortOrder`: asc or desc

**Example:**
```bash
GET /api/food/list?page=1&limit=12&category=Salad&search=chicken&sortBy=price&sortOrder=asc

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

### Orders List API (Admin)

**Endpoint:** `GET /api/order/list`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `sortBy`: Sort field (date, amount)
- `sortOrder`: asc or desc

**Example:**
```bash
GET /api/order/list?page=1&status=Delivered&sortBy=date&sortOrder=desc

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## 📊 Database Indexes

For optimal performance, indexes added:

**Order Model:**
```javascript
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });
```

**Voucher Model:**
```javascript
voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1, endDate: 1 });
```

---

## 🧪 Testing Phase 2 Features

### 1. Test Order Status Flow

```bash
# Create admin user
npm run create-admin

# Login as admin
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fooddelivery.com","password":"Admin@123456"}'

# Update order status
curl -X POST http://localhost:4000/api/order/status \
  -H "Content-Type: application/json" \
  -H "token: YOUR_ADMIN_TOKEN" \
  -d '{
    "orderId": "ORDER_ID",
    "status": "Preparing",
    "note": "Chef is preparing your order"
  }'
```

### 2. Test Voucher System

```bash
# Create sample vouchers
npm run create-vouchers

# Validate voucher (as logged-in user)
curl -X POST http://localhost:4000/api/voucher/validate \
  -H "Content-Type: application/json" \
  -H "token: YOUR_TOKEN" \
  -d '{
    "code": "WELCOME10",
    "orderAmount": 200000
  }'

# Place order with voucher
curl -X POST http://localhost:4000/api/order/placeOrder \
  -H "Content-Type: application/json" \
  -H "token: YOUR_TOKEN" \
  -d '{
    "address": {...},
    "items": [...],
    "amount": 200000,
    "voucherCode": "WELCOME10"
  }'
```

### 3. Test Pagination

```bash
# Get food list with filters
curl "http://localhost:4000/api/food/list?page=1&limit=10&category=Salad&sortBy=price&sortOrder=asc"

# Get orders (admin)
curl "http://localhost:4000/api/order/list?page=1&limit=20&status=Paid" \
  -H "token: YOUR_ADMIN_TOKEN"
```

---

## 📝 Migration Notes

### Existing Orders

Old orders created before Phase 2 may not have:
- Item snapshots
- Status history
- Voucher info
- Subtotal/delivery fee breakdown

These orders will continue to work but with limited data.

### Status Migration

Old status "Food processing" → Update code to handle or migrate to "Preparing"

---

## 🎯 Next Steps (Phase 3 - Frontend)

Backend is ready! Now integrate with frontend:

1. **Update PlaceOrder.jsx**
   - Add voucher code input
   - Validate voucher before checkout
   - Display discount amount

2. **Add Toast Notifications**
   - Success/error messages
   - Order status updates

3. **Add Loading States**
   - Skeleton screens
   - Spinners during API calls

4. **Implement Search & Filter**
   - Category filter
   - Search bar
   - Sort dropdown

5. **Add Infinite Scroll / Pagination**
   - Load more button
   - Or infinite scroll

6. **Order Tracking Page**
   - Show status history
   - Real-time updates (optional WebSocket)

---

## 📚 Scripts

| Command | Description |
|---------|-------------|
| `npm run create-admin` | Create admin user |
| `npm run create-vouchers` | Create sample vouchers |
| `npm start` | Start production server |
| `npm run server` | Start development server with nodemon |

---

## ✨ Summary

**Phase 2 Achievements:**
- ✅ Professional order status workflow
- ✅ Complete voucher/discount system
- ✅ Item price snapshots in orders
- ✅ Status history tracking
- ✅ Pagination & filtering APIs
- ✅ Database performance indexes
- ✅ Admin voucher management

**Phase 2 APIs Added:**
- `POST /api/voucher/validate`
- `POST /api/voucher/create` (admin)
- `GET /api/voucher/list` (admin)
- `GET /api/voucher/active`
- `POST /api/voucher/update` (admin)
- `POST /api/voucher/delete` (admin)

**Phase 2 Enhancements:**
- `GET /api/food/list` - Now supports pagination, search, filter, sort
- `GET /api/order/list` - Now supports pagination, status filter, sort
- `POST /api/order/placeOrder` - Now supports voucher codes
- `POST /api/order/status` - Now tracks history

🎉 **Backend Phase 2 Complete!** Ready for frontend integration.

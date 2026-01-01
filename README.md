# 🍔 Food Delivery Website - HVT Food Deli

Website đặt đồ ăn trực tuyến với giao diện hiện đại, hỗ trợ đặt hàng, thanh toán và quản lý đơn hàng.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Git Workflow](#-git-workflow)

## ✨ Tính năng

### Khách hàng (Frontend)
- 🏠 Trang chủ với danh mục món ăn đa dạng
- 🔍 Tìm kiếm và lọc món ăn theo danh mục
- 🛒 Giỏ hàng với tính năng thêm/xóa món
- 💳 Thanh toán trực tuyến (VNPay integration)
- 📦 Theo dõi đơn hàng real-time
- 👤 Đăng nhập/Đăng ký tài khoản
- ⭐ Đánh giá món ăn

### Quản trị (Admin)
- ➕ Thêm/sửa/xóa món ăn
- 📊 Quản lý đơn hàng
- 📈 Thống kê doanh thu và báo cáo
- 🖼️ Upload hình ảnh món ăn
- 📋 Quản lý danh mục

## 🛠️ Công nghệ sử dụng

### Frontend & Admin
- **React 19** - Thư viện UI
- **Vite** - Build tool & dev server
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **FontAwesome** - Icons
- **Lucide React** - Modern icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **CORS** - Cross-origin resource sharing

## 🏗️ Kiến trúc hệ thống

```mermaid
graph TB
    subgraph "Client Side"
        A[Frontend - React<br/>Port 5173]
        B[Admin Panel - React<br/>Port 5174]
    end
    
    subgraph "Server Side"
        C[Backend API - Express<br/>Port 4000]
        D[(MongoDB Database)]
    end
    
    subgraph "External Services"
        E[VNPay Payment Gateway]
    end
    
    A -->|API Requests| C
    B -->|API Requests| C
    C -->|CRUD Operations| D
    A -->|Payment| E
    E -->|Callback| C
```

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 16.x
- npm hoặc yarn
- MongoDB (local hoặc MongoDB Atlas)

### Bước 1: Clone repository

```bash
git clone https://github.com/HoTra171/Food-Delivery-HTV.git
cd "Food Delivery Website"
```

### Bước 2: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-delivery
JWT_SECRET=your_jwt_secret_key_here
PORT=4000
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment-return
```

### Bước 3: Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### Bước 4: Cài đặt Admin

```bash
cd ../admin
npm install
```

## 🚀 Sử dụng

### Chạy Backend

```bash
cd backend
npm run server
```

Backend sẽ chạy tại: `http://localhost:4000`

### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Chạy Admin Panel

```bash
cd admin
npm run dev
```

Admin panel sẽ chạy tại: `http://localhost:5174`

> **Lưu ý**: Cần chạy cả 3 services (backend, frontend, admin) đồng thời để hệ thống hoạt động đầy đủ.

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/user/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/api/user/login` | Đăng nhập | ❌ |

### Food Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/food/list` | Lấy danh sách món ăn | ❌ |
| POST | `/api/food/add` | Thêm món ăn mới | ✅ Admin |
| POST | `/api/food/remove` | Xóa món ăn | ✅ Admin |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/cart/add` | Thêm món vào giỏ | ✅ |
| POST | `/api/cart/remove` | Xóa món khỏi giỏ | ✅ |
| GET | `/api/cart/get` | Lấy giỏ hàng | ✅ |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/order/place` | Đặt hàng | ✅ |
| GET | `/api/order/userorders` | Lấy đơn hàng của user | ✅ |
| GET | `/api/order/list` | Lấy tất cả đơn hàng | ✅ Admin |
| POST | `/api/order/status` | Cập nhật trạng thái | ✅ Admin |

### Static Files

| Endpoint | Description |
|----------|-------------|
| `/images/:filename` | Truy cập hình ảnh món ăn |

## 📸 Screenshots

### Trang chủ
![Homepage](./screenshots/homepage.png)

*Giao diện trang chủ với hero section và danh mục món ăn*

### Giỏ hàng
![Cart](./screenshots/cart.png)

*Trang giỏ hàng với tổng kết đơn hàng*

### Admin - Thêm món ăn
![Admin Add](./screenshots/admin-add.png)

*Giao diện thêm món ăn mới trong admin panel*

### Admin - Danh sách món ăn
![Admin List](./screenshots/admin-list.png)

*Quản lý danh sách tất cả món ăn*

## 🌐 Deployment

### Option 1: Deploy Frontend lên Vercel

```bash
cd frontend
npm run build

# Deploy với Vercel CLI
npm i -g vercel
vercel --prod
```

**Environment Variables cần thiết trên Vercel:**
- `VITE_API_URL`: URL của backend API

### Option 2: Deploy Frontend lên Netlify

```bash
cd frontend
npm run build

# Deploy với Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy Backend lên Render

1. Tạo tài khoản tại [Render.com](https://render.com)
2. Tạo Web Service mới
3. Connect với GitHub repository
4. Cấu hình:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run server`
   - **Environment Variables**: Thêm tất cả biến trong `.env`

### Deploy Backend lên Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login và deploy
railway login
cd backend
railway init
railway up
```

### MongoDB Atlas Setup

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới (Free tier)
3. Tạo database user
4. Whitelist IP: `0.0.0.0/0` (cho phép tất cả)
5. Lấy connection string và cập nhật vào `MONGODB_URI`

### CORS Configuration cho Production

Trong `backend/server.js`, cập nhật CORS:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://your-admin-domain.vercel.app'
  ],
  credentials: true
}));
```

## 📝 Git Workflow

### Commit History hiện tại

```bash
1f70497 - cart (HEAD -> main)
88b02ed - cart
24b3b5e - cartt tracking
fc58df5 - Home
85ea2c8 - Inittial commit
```

### Best Practices cho Commit Messages

Sử dụng **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật documentation
- `style`: Thay đổi formatting, không ảnh hưởng code
- `refactor`: Refactor code
- `test`: Thêm tests
- `chore`: Cập nhật build tasks, package manager

**Ví dụ:**

```bash
git commit -m "feat(cart): add remove item functionality"
git commit -m "fix(auth): resolve JWT token expiration issue"
git commit -m "docs: update README with deployment guide"
```

### Branching Strategy

```bash
# Tạo branch cho feature mới
git checkout -b feature/payment-integration

# Tạo branch cho bug fix
git checkout -b fix/cart-total-calculation

# Merge về main
git checkout main
git merge feature/payment-integration
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập.

## 👨‍💻 Tác giả

**Hồ Viết Trà**
- GitHub: [@HoTra171](https://github.com/HoTra171)

## 🙏 Acknowledgments

- React Documentation
- Express.js Guide
- MongoDB University
- VNPay Integration Guide

---

**⭐ Nếu thấy project hữu ích, hãy cho một star nhé!**

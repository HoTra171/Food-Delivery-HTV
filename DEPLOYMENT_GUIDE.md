# Hướng Dẫn Deploy Food Delivery Website

## 🚀 Deploy Backend (Render.com)

### 1. Tạo Web Service trên Render
1. Đăng nhập [Render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect GitHub repository của bạn
4. Cấu hình:
   - **Name**: `food-delivery-backend`
   - **Region**: Singapore
   - **Branch**: main
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 2. Cấu hình Environment Variables
Vào tab **Environment** và thêm các biến:

```env
MONGODB_URI=mongodb+srv://fooddelivery_user:trabn1712003@cluster0.eu5pnre.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=random#secret

PORT=4000

VNP_TMNCODE=MLBLI5WS

VNP_HASHSECRET=2XOUYI6YEQQ2WL8RK5T550IWVYUYRXAP

VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html

VNP_RETURN_URL=https://food-delivery-frontend-wheat.vercel.app/payment-success
```

⚠️ **QUAN TRỌNG**: 
- `VNP_RETURN_URL` phải là URL frontend production của bạn
- Không có dấu cách trước/sau dấu `=`

### 3. Deploy
- Click **Create Web Service**
- Đợi deploy hoàn tất (5-10 phút)
- Copy URL backend (ví dụ: `https://food-delivery-backend.onrender.com`)

---

## 🎨 Deploy Frontend (Vercel)

### 1. Deploy Frontend User
1. Đăng nhập [Vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import repository
4. Cấu hình:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Thêm Environment Variables
Vào **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://food-delivery-backend.onrender.com
```

⚠️ **QUAN TRỌNG**: 
- Thay `https://food-delivery-backend.onrender.com` bằng URL backend thực của bạn
- **KHÔNG có dấu `/` ở cuối URL**

### 3. Redeploy
- Vào tab **Deployments**
- Click **Redeploy** để áp dụng env vars

---

## 👨‍💼 Deploy Admin Panel (Vercel)

### 1. Deploy Admin
1. Trên Vercel, click **Add New** → **Project**
2. Import cùng repository
3. Cấu hình:
   - **Root Directory**: `admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Thêm Environment Variables
```env
VITE_API_URL=https://food-delivery-backend.onrender.com
```

### 3. Redeploy

---

## ✅ Checklist Sau Khi Deploy

### Backend
- [ ] Backend đang chạy (check Render logs)
- [ ] MongoDB connected successfully
- [ ] API hoạt động: `https://your-backend.onrender.com/`

### Frontend
- [ ] Trang chủ load được
- [ ] Đăng ký/đăng nhập hoạt động
- [ ] Xem danh sách món ăn
- [ ] Thêm vào giỏ hàng
- [ ] Đặt hàng và thanh toán VNPAY
- [ ] Payment return về đúng trang

### Admin
- [ ] Đăng nhập admin
- [ ] Thêm/sửa/xóa món ăn
- [ ] Xem danh sách đơn hàng
- [ ] Cập nhật trạng thái đơn hàng
- [ ] Xem báo cáo doanh thu

---

## 🔧 Troubleshooting

### Lỗi: "Failed to fetch" / "Network Error"
**Nguyên nhân**: Frontend không kết nối được backend

**Giải pháp**:
1. Check VITE_API_URL có đúng không
2. Check backend có đang chạy không (vào Render logs)
3. Check CORS đã cấu hình đúng frontend domain chưa

### Lỗi: "Lỗi tạo URL thanh toán"
**Nguyên nhân**: Thiếu hoặc sai env vars cho VNPAY

**Giải pháp**:
1. Vào Render → Environment → Check các biến:
   - `VNP_TMNCODE`
   - `VNP_HASHSECRET`
   - `VNP_URL`
   - `VNP_RETURN_URL`
2. Đảm bảo `VNP_RETURN_URL` trỏ đúng về frontend production
3. Redeploy backend sau khi sửa env vars

### Lỗi: CORS blocked
**Nguyên nhân**: Domain frontend chưa được thêm vào whitelist

**Giải pháp**:
1. Mở file `backend/server.js`
2. Thêm domain vào `allowedOrigins`:
```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app',
    'https://your-admin-domain.vercel.app'
];
```
3. Push code và redeploy

### Lỗi: "401 Unauthorized" khi gọi admin API
**Nguyên nhân**: User chưa có role admin

**Giải pháp**:
1. Connect MongoDB (MongoDB Compass hoặc Studio 3T)
2. Tìm user admin trong collection `users`
3. Update field `role` thành `"admin"`
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Lỗi: Images không hiển thị
**Nguyên nhân**: File upload lưu local, không sync với deploy

**Giải pháp** (Nâng cao):
1. Sử dụng cloud storage (AWS S3, Cloudinary)
2. Hoặc dùng Render Persistent Disk
3. Update multer config để upload lên cloud

---

## 📝 Cập Nhật URL Trong Code

### Nếu domain thay đổi:

1. **Update backend URL trong frontend**:
   - Vercel → Project → Settings → Environment Variables
   - Update `VITE_API_URL`
   - Redeploy

2. **Update frontend URL trong backend**:
   - File `backend/server.js` → `allowedOrigins`
   - Render → Environment → Update `VNP_RETURN_URL`
   - Redeploy

3. **Update VNPAY return URL**:
   - Render → Environment → `VNP_RETURN_URL`
   - Đảm bảo format: `https://your-domain.vercel.app/payment-success`
   - Redeploy

---

## 🔐 Security Notes

### Production Checklist:
- [ ] Thay đổi `JWT_SECRET` thành giá trị bảo mật
- [ ] Giới hạn CORS chỉ cho domains cụ thể (đã làm)
- [ ] Sử dụng HTTPS cho tất cả endpoints (Render/Vercel tự động)
- [ ] Không commit file `.env` lên Git
- [ ] Sử dụng MongoDB user với quyền hạn chế
- [ ] Enable rate limiting (khuyến nghị)
- [ ] Setup monitoring và logging

### Biến Cần Giữ Bí Mật:
- `JWT_SECRET`
- `MONGODB_URI` (có password)
- `VNP_TMNCODE`
- `VNP_HASHSECRET`

**KHÔNG BAO GIỜ** commit các giá trị này lên public repository!

---

## 📊 Monitoring

### Backend Health Check
```bash
curl https://your-backend.onrender.com/
# Should return: "API working"
```

### Check Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Deployments → Click deployment → View Function Logs

### Database Connection
- Check Render logs for: `MongoDB connected successfully`
- Nếu lỗi: Check MongoDB Atlas network access (whitelist IP `0.0.0.0/0` cho Render)

---

## 🆘 Support

Nếu gặp lỗi:
1. Check logs trên Render/Vercel
2. Check browser console (F12) 
3. Check Network tab để xem API calls
4. Verify tất cả env vars đã cấu hình đúng

### Common Issues:
- **Render free tier**: Backend có thể sleep sau 15 phút không dùng → First request sẽ chậm (30s-1min)
- **MongoDB Atlas**: Cần whitelist IP của Render (dùng `0.0.0.0/0` cho all IPs)
- **Vercel**: Build timeout? Check package.json dependencies

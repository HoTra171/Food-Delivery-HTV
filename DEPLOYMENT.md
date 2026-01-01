# 🚀 Hướng dẫn Deploy lên Production

## Bước 1: Setup MongoDB Atlas

1. **Truy cập MongoDB Atlas**
   - Đăng nhập vào https://cloud.mongodb.com/

2. **Tạo Cluster**
   - Click "Build a Database"
   - Chọn **FREE** tier (M0)
   - Chọn region: **Singapore** (gần Việt Nam nhất)
   - Cluster Name: `food-delivery-cluster`
   - Click "Create"

3. **Tạo Database User**
   - Vào tab "Database Access"
   - Click "Add New Database User"
   - Username: `fooddelivery_user`
   - Password: Tự động generate (LƯU LẠI PASSWORD NÀY!)
   - Database User Privileges: **Read and write to any database**
   - Click "Add User"

4. **Cấu hình Network Access**
   - Vào tab "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Lấy Connection String**
   - Quay lại tab "Database"
   - Click "Connect" trên cluster của bạn
   - Chọn "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://fooddelivery_user:<password>@cluster.mongodb.net/food-delivery`
   - **Thay `<password>` bằng password bạn đã lưu ở bước 3**
   - **LƯU LẠI CONNECTION STRING NÀY!**

---

## Bước 2: Deploy Backend lên Render

1. **Push code lên GitHub**
   ```bash
   git add .
   git commit -m "feat: prepare for production deployment"
   git push origin main
   ```

2. **Truy cập Render**
   - Đăng nhập vào https://render.com/
   - Click "New +" → "Web Service"

3. **Connect GitHub Repository**
   - Chọn repository: `HoTra171/Food-Delivery-HTV`
   - Click "Connect"

4. **Cấu hình Web Service**
   - **Name**: `food-delivery-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Thêm Environment Variables**
   Click "Advanced" → "Add Environment Variable", thêm các biến sau:

   ```
   MONGODB_URI = mongodb+srv://fooddelivery_user:<password>@cluster.mongodb.net/food-delivery
   JWT_SECRET = your_super_secret_jwt_key_change_this_in_production_12345
   PORT = 4000
   VNPAY_TMN_CODE = (nếu có)
   VNPAY_HASH_SECRET = (nếu có)
   VNPAY_URL = https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   VNPAY_RETURN_URL = (sẽ cập nhật sau khi deploy frontend)
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Đợi 5-10 phút để Render build và deploy
   - Sau khi deploy xong, bạn sẽ có URL dạng: `https://food-delivery-backend-xxxx.onrender.com`
   - **LƯU LẠI URL NÀY!**

7. **Test Backend**
   - Truy cập: `https://food-delivery-backend-xxxx.onrender.com/`
   - Bạn sẽ thấy: "API working"

---

## Bước 3: Deploy Frontend lên Vercel

1. **Truy cập Vercel**
   - Đăng nhập vào https://vercel.com/
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Chọn repository: `HoTra171/Food-Delivery-HTV`
   - Click "Import"

3. **Cấu hình Project**
   - **Project Name**: `food-delivery-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - Click "Edit" bên cạnh "Build and Output Settings"

4. **Build Settings**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables**
   Click "Environment Variables", thêm:
   ```
   VITE_API_URL = https://food-delivery-backend-xxxx.onrender.com/
   ```
   (Thay `xxxx` bằng URL backend của bạn từ Bước 2)

6. **Deploy**
   - Click "Deploy"
   - Đợi 2-3 phút
   - Sau khi deploy xong, bạn sẽ có URL dạng: `https://food-delivery-frontend-xxxx.vercel.app`
   - **LƯU LẠI URL NÀY!**

---

## Bước 4: Deploy Admin lên Vercel

1. **Tạo Project mới trên Vercel**
   - Click "Add New..." → "Project"
   - Chọn repository: `HoTra171/Food-Delivery-HTV`

2. **Cấu hình Project**
   - **Project Name**: `food-delivery-admin`
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`

3. **Build Settings**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   ```
   VITE_API_URL = https://food-delivery-backend-xxxx.onrender.com/
   ```

5. **Deploy**
   - Click "Deploy"
   - Sau khi deploy xong: `https://food-delivery-admin-xxxx.vercel.app`

---

## Bước 5: Cập nhật VNPAY Return URL (Nếu có)

1. **Quay lại Render Dashboard**
   - Vào Web Service "food-delivery-backend"
   - Vào tab "Environment"
   - Sửa biến `VNPAY_RETURN_URL`:
     ```
     VNPAY_RETURN_URL = https://food-delivery-frontend-xxxx.vercel.app/payment-return
     ```
   - Click "Save Changes"
   - Backend sẽ tự động redeploy

---

## Bước 6: Test Production

### Test Frontend
1. Truy cập frontend URL
2. Đăng ký tài khoản mới
3. Đăng nhập
4. Xem danh sách món ăn
5. Thêm món vào giỏ hàng
6. Đặt hàng

### Test Admin
1. Truy cập admin URL
2. Đăng nhập (cần tạo admin user trong database)
3. Thêm món ăn mới
4. Xem danh sách đơn hàng

---

## Bước 7: Cập nhật README.md

Thêm links vào README.md:

```markdown
## 🌐 Live Demo

- **Frontend (Customer)**: https://food-delivery-frontend-xxxx.vercel.app
- **Admin Panel**: https://food-delivery-admin-xxxx.vercel.app
- **Backend API**: https://food-delivery-backend-xxxx.onrender.com
```

Commit và push:
```bash
git add README.md
git commit -m "docs: add live demo links"
git push origin main
```

---

## ⚠️ Lưu ý quan trọng

### Render Free Tier
- Backend sẽ **sleep sau 15 phút không hoạt động**
- Lần đầu truy cập sau khi sleep sẽ mất 30-60 giây để wake up
- Đây là bình thường với free tier

### Vercel Free Tier
- 100GB bandwidth/tháng
- Đủ cho demo và portfolio

### MongoDB Atlas Free Tier
- 512MB storage
- Đủ cho demo

### Nếu gặp lỗi CORS
- Kiểm tra backend đã deploy thành công chưa
- Kiểm tra `VITE_API_URL` có đúng không (phải có `/` ở cuối)
- Kiểm tra backend logs trên Render

---

## 🎉 Hoàn thành!

Bây giờ bạn có thể:
1. Thêm links vào CV
2. Chia sẻ với bạn bè
3. Demo cho nhà tuyển dụng

**Chúc mừng! 🎊**

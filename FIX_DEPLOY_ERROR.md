# 🚨 FIX LỖI DEPLOY HIỆN TẠI

## Vấn đề: "Lỗi tạo URL thanh toán" trên Vercel

### ✅ Checklist Sửa Lỗi (Làm theo thứ tự)

---

## BƯỚC 1: Fix Backend trên Render

### 1.1 Update Environment Variables
Vào **Render Dashboard** → Chọn backend service → **Environment**

**Xóa các biến cũ (nếu có):**
- ❌ `VNPAY_TMN_CODE`
- ❌ `VNPAY_HASH_SECRET`
- ❌ `VNPAY_URL`
- ❌ `VNPAY_RETURN_URL`

**Thêm các biến mới:**
```
VNP_TMNCODE=MLBLI5WS
VNP_HASHSECRET=2XOUYI6YEQQ2WL8RK5T550IWVYUYRXAP
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=https://food-delivery-frontend-wheat.vercel.app/payment-success
```

⚠️ **Lưu ý:** 
- Không có khoảng trắng trước/sau dấu `=`
- `VNP_RETURN_URL` phải là domain frontend thật của bạn

### 1.2 Push Code Mới
```bash
cd "H:\HocTap\LapTrinh\laptrinhweb\Food Delivery Website"
git add .
git commit -m "Fix VNPAY env vars and CORS for production"
git push
```

### 1.3 Manual Deploy (hoặc chờ auto deploy)
- Vào Render Dashboard → Backend Service
- Click **Manual Deploy** → Deploy latest commit
- Đợi deploy xong (3-5 phút)

### 1.4 Kiểm tra Logs
- Vào **Logs** tab
- Tìm dòng: `MongoDB connected successfully`
- Tìm dòng: `Server Started on http://...`
- **KHÔNG có lỗi CORS hoặc env vars**

---

## BƯỚC 2: Kiểm tra Frontend trên Vercel

### 2.1 Check Environment Variables
Vào **Vercel Dashboard** → Frontend Project → **Settings** → **Environment Variables**

Phải có:
```
VITE_API_URL=https://food-delivery-backend-XXXX.onrender.com
```

⚠️ Thay `XXXX` bằng URL backend thực của bạn

### 2.2 Nếu chưa có → Thêm vào
1. Click **Add New**
2. **Name**: `VITE_API_URL`
3. **Value**: `https://your-backend-url.onrender.com`
4. Apply to: **All** (Production, Preview, Development)
5. Click **Save**

### 2.3 Redeploy Frontend
- Vào tab **Deployments**
- Click **...** menu của deployment mới nhất
- Click **Redeploy**
- Chọn **Use existing Build Cache**: NO
- Click **Redeploy**

---

## BƯỚC 3: Kiểm tra Admin Panel (nếu dùng)

Làm tương tự như Frontend:
1. Check có `VITE_API_URL` chưa
2. Nếu chưa → thêm vào
3. Redeploy

---

## BƯỚC 4: Test Lại

### 4.1 Kiểm tra Backend
Mở browser, vào:
```
https://your-backend-url.onrender.com/
```
Phải thấy: **"API working"**

### 4.2 Kiểm tra Frontend
1. Vào `https://food-delivery-frontend-wheat.vercel.app`
2. Đăng ký/đăng nhập
3. Thêm món vào giỏ hàng
4. Checkout
5. Phải tạo được payment URL và redirect sang VNPAY

### 4.3 Nếu vẫn lỗi
Mở **Browser Console** (F12):
- Tab **Console**: Xem lỗi gì
- Tab **Network**: Click vào request bị lỗi, xem:
  - Request URL có đúng không
  - Status code là gì (401, 403, 404, 500?)
  - Response message là gì

---

## BƯỚC 5: Debug Nếu Vẫn Lỗi

### Lỗi: "Failed to fetch"
**Nguyên nhân**: Frontend không kết nối được backend

**Giải pháp:**
1. Check `VITE_API_URL` có đúng không
2. Check backend có running không (vào Render logs)
3. Test backend trực tiếp bằng Postman/curl

### Lỗi: "CORS blocked"
**Nguyên nhân**: Backend chưa cho phép frontend domain

**Giải pháp:**
- File `backend/server.js` đã update để allow `food-delivery-frontend-wheat.vercel.app`
- Nếu domain khác → sửa lại array `allowedOrigins`
- Push code và deploy lại

### Lỗi: "VNP_TMNCODE is undefined"
**Nguyên nhân**: Env vars chưa được set đúng

**Giải pháp:**
1. Vào Render → Environment → Check lại tên biến
2. Phải là `VNP_TMNCODE` không phải `VNPAY_TMN_CODE`
3. Save và deploy lại

### Lỗi: "401 Unauthorized"
**Nguyên nhân**: Token không hợp lệ hoặc hết hạn

**Giải pháp:**
1. Logout và login lại
2. Clear browser cache
3. Check JWT_SECRET trên Render có đúng không

---

## 📝 Summary

### Files đã thay đổi:
1. ✅ `backend/controllers/orderController.js` - Fix env var names
2. ✅ `backend/server.js` - Fix CORS for production
3. ✅ `render.yaml` - Update env var names
4. ✅ `DEPLOYMENT_GUIDE.md` - Full deployment instructions

### Cần làm trên Platform:
1. ✅ Render: Update env vars từ `VNPAY_*` → `VNP_*`
2. ✅ Render: Redeploy backend
3. ✅ Vercel: Add `VITE_API_URL` env var
4. ✅ Vercel: Redeploy frontend
5. ✅ Test lại toàn bộ flow

---

## ⏱️ Expected Timeline

- Update env vars: 2 phút
- Push code: 1 phút
- Backend redeploy: 3-5 phút
- Frontend redeploy: 1-2 phút
- **Tổng: ~10 phút**

---

## 🆘 Nếu vẫn không được

Gửi cho tôi:
1. Screenshot lỗi từ browser console
2. Screenshot Render logs
3. URL backend của bạn
4. Tôi sẽ debug tiếp!

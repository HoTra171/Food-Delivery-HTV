// Delivery Fee
export const DELIVERY_FEE = 15000; // VND

// Toast Display Time
export const TOAST_DURATION = 3000; // milliseconds

// API Timeout
export const API_TIMEOUT = 30000; // milliseconds

// Pagination
export const ITEMS_PER_PAGE = 12;

// Image Dimensions
export const FOOD_IMAGE_SIZE = {
  width: 240,
  height: 240
};

// Breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  OUT_FOR_DELIVERY: 'Đang giao hàng',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'Thanh toán khi nhận hàng',
  VNPAY: 'VNPay',
  MOMO: 'MoMo'
};

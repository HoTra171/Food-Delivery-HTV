// /frontend/pages/PaymentReturn.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of query.entries()) {
      params[key] = value;
    }

    const verify = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const res = await axios.post(`${apiUrl}/api/order/verify`, params);
        if (res.data.success) {
          alert("Thanh toán thành công!");
          navigate("/myorders");
        } else {
          alert("Thanh toán thất bại.");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi kết nối máy chủ");
        navigate("/");
      }
    };

    verify();
  }, [location.search]);

  return (
    <div className='paymentReturn'>
      <h2>Đang xác minh thanh toán...</h2>
    </div>
  );
};

export default PaymentReturn;

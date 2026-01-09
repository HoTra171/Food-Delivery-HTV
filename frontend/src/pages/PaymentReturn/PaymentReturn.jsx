// /frontend/pages/PaymentReturn.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';
import './PaymentReturn.css';

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of query.entries()) {
      params[key] = value;
    }

    const verify = async () => {
      try {
        setVerifying(true);
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const res = await axios.post(`${apiUrl}/api/order/verify`, params);

        if (res.data.success) {
          toast.success("Thanh toán thành công!");
          setTimeout(() => navigate("/myorders"), 1500);
        } else {
          toast.error("Thanh toán thất bại.");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        toast.error("Lỗi kết nối máy chủ. Vui lòng liên hệ CSKH.");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setVerifying(false);
      }
    };

    if (Object.keys(params).length > 0) {
      verify();
    } else {
      toast.warning("Không tìm thấy thông tin thanh toán");
      navigate("/");
    }
  }, [location.search, navigate]);

  return (
    <div className='payment-return'>
      <div className="payment-return-content">
        {verifying ? (
          <>
            <Spinner size="large" message="Đang xác minh thanh toán..." />
            <p className="payment-subtitle">Vui lòng đợi trong giây lát</p>
          </>
        ) : (
          <h2>Đang chuyển hướng...</h2>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;

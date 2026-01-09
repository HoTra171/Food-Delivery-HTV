import { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import axios from 'axios'
import { DELIVERY_FEE } from '../../constants'
import './PlaceOrder.css'
import '../Cart/Cart.css'



const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  })

  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [validatingVoucher, setValidatingVoucher] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value
    })
  }

  const validateVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Vui lòng nhập mã voucher')
      return
    }

    setValidatingVoucher(true)
    try {
      const totalBeforeDiscount = getTotalCartAmount() + DELIVERY_FEE
      const response = await axios.post(`${url}/api/voucher/validate`, {
        code: voucherCode,
        orderAmount: totalBeforeDiscount
      }, {
        headers: { token }
      })

      if (response.data.success) {
        setDiscount(response.data.voucher.discountAmount)
        toast.success(`Áp dụng voucher thành công! Giảm ${response.data.voucher.discountAmount} VNĐ`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Voucher không hợp lệ')
      setDiscount(0)
    } finally {
      setValidatingVoucher(false)
    }
  }

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      toast.error('Email không hợp lệ')
      return false
    }

    // Phone validation (Vietnamese phone format)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/
    if (!phoneRegex.test(data.phone)) {
      toast.error('Số điện thoại không hợp lệ (VD: 0912345678)')
      return false
    }

    // Check all required fields
    const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'country']
    for (const field of requiredFields) {
      if (!data[field].trim()) {
        toast.error('Vui lòng điền đầy đủ thông tin')
        return false
      }
    }

    return true
  }

  const placeOrder = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    if (orderItems.length === 0) {
      toast.error('Giỏ hàng trống')
      setLoading(false)
      return
    }

    const totalAmount = getTotalCartAmount() + DELIVERY_FEE;

    try {
      const orderData = {
        address: data,
        items: orderItems,
        amount: totalAmount
      }

      // Add voucher if validated
      if (discount > 0 && voucherCode) {
        orderData.voucherCode = voucherCode
        orderData.discountAmount = discount
      }

      const response = await axios.post(`${url}/api/order/placeOrder`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Đơn hàng đã tạo! Chuyển đến thanh toán...')
        setTimeout(() => {
          window.location.href = response.data.payment_url;
        }, 1000)
      } else {
        toast.error(response.data.message || "Lỗi tạo đơn hàng")
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng")
      setLoading(false)
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/cart')
      toast.warning("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi đặt hàng.")
    }
    else if (getTotalCartAmount() === 0) {
      toast.warning("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.")
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Họ' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Tên' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Email' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Địa chỉ' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Thành phố' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Quận/Huyện' />
        </div>
        <div className="multi-fields">
          <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='Mã bưu điện' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Quốc gia' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng đơn hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng tiền hàng</p>
              <p>{getTotalCartAmount().toLocaleString()} VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{getTotalCartAmount() === 0 ? 0 : DELIVERY_FEE.toLocaleString()} VNĐ</p>
            </div>
            <hr />

            {/* Voucher Section */}
            <div className="voucher-section" style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <button
                  type="button"
                  onClick={validateVoucher}
                  disabled={validatingVoucher || !voucherCode.trim()}
                  style={{
                    padding: '10px 20px',
                    background: validatingVoucher ? '#ccc' : '#ff6347',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: validatingVoucher ? 'not-allowed' : 'pointer'
                  }}
                >
                  {validatingVoucher ? 'Đang kiểm tra...' : 'Áp dụng'}
                </button>
              </div>
              {discount > 0 && (
                <div className="cart-total-details" style={{ color: '#28a745' }}>
                  <p>Giảm giá ({voucherCode})</p>
                  <p>-{discount.toLocaleString()} VNĐ</p>
                </div>
              )}
            </div>

            <hr />
            <div className="cart-total-details">
              <b>Tổng thanh toán</b>
              <b>{getTotalCartAmount() === 0 ? 0 : (getTotalCartAmount() + DELIVERY_FEE - discount).toLocaleString()} VNĐ</b>
            </div>
          </div>
          <button type='submit' disabled={loading}>
            {loading ? 'Đang xử lý...' : 'TIẾN HÀNH THANH TOÁN'}
          </button>
        </div>
      </div>
    </form >
  )
}

export default PlaceOrder

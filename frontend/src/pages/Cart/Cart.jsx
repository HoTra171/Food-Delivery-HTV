import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { DELIVERY_FEE } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons'
import './Cart.css'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext)
  const navigate = useNavigate();

  const deleteItem = (itemId) => {
    // Remove all quantities of this item
    const quantity = cartItems[itemId]
    for (let i = 0; i < quantity; i++) {
      removeFromCart(itemId)
    }
  }

  const cartItemsCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);

  if (cartItemsCount === 0) {
    return (
      <div className='cart'>
        <div className="empty-cart">
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <button onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Hình ảnh</p>
          <p>Tên món</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Tổng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />

        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt={item.name} loading="lazy" />
                  <p>{item.name}</p>
                  <p>{item.price.toLocaleString()} VNĐ</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="quantity-btn"
                      aria-label="Giảm số lượng"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="quantity-value">{cartItems[item._id]}</span>
                    <button
                      onClick={() => addToCart(item._id)}
                      className="quantity-btn"
                      aria-label="Tăng số lượng"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <p>{(item.price * cartItems[item._id]).toLocaleString()} VNĐ</p>
                  <button
                    className='delete-btn'
                    onClick={() => deleteItem(item._id)}
                    aria-label="Xóa sản phẩm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng tiền hàng</p>
              <p>{getTotalCartAmount().toLocaleString()} VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{DELIVERY_FEE.toLocaleString()} VNĐ</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{(getTotalCartAmount() + DELIVERY_FEE).toLocaleString()} VNĐ</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>TIẾN HÀNH ĐẶT HÀNG</button>
        </div>
      </div>
    </div>
  )
}

export default Cart

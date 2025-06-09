import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import './Orders.css'
import { assets } from '../../../../frontend/src/assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list')
    console.log(response.data)
    if (response.data.success) {
      setOrders(response.data.data)
      console.log(response.data.data)
    } else {
      toast.error("Error")
    }
  }

  const statusHandler = async (e, orderId) => {
    const response = await axios.post(url + '/api/order/status', {
      orderId: orderId,
      status: e.target.value
    })
    if (response.data.success) {
      toast.success("Status Updated")
      fetchAllOrders()
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return item.name + "x" + item.quantity;
                  } else {
                    return item.name + "x" + item.quantity + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Item: {order.items.length}</p>
            <p>{order.amount} VNĐ</p>
            <select onChange={(e)=>statusHandler(e, order._id)}value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders

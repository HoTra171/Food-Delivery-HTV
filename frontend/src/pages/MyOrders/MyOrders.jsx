import { useState, useContext, useEffect } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './MyOrders.css'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const MyOrders = () => {

    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.post(url + '/api/order/userOrders', {}, { headers: { token } })
            if (response.data.success && Array.isArray(response.data.data)) {
                setData(response.data.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error("Không thể tải danh sách đơn hàng")
            setData([])
        } finally {
            setLoading(false)
        }
    }

    const trackOrder = async (orderId) => {
        try {
            const response = await axios.post(url + '/api/order/userOrders', {}, { headers: { token } })
            if (response.data.success) {
                const order = response.data.data.find(o => o._id === orderId)
                if (order) {
                    toast.info(`Trạng thái đơn hàng: ${order.status}`)
                    await fetchOrders() // Refresh orders
                }
            }
        } catch (error) {
            console.error("Error tracking order:", error)
            toast.error("Không thể cập nhật trạng thái đơn hàng")
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders()
        }
    }, [token])

    return (
        <div className='my-orders'>
            <h2>Đơn hàng của tôi</h2>
            <div className="container">
                {loading ? (
                    <div className="loading-state">
                        <p>Đang tải đơn hàng...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="empty-state">
                        <p>Bạn chưa có đơn hàng nào</p>
                    </div>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="Order icon" />
                            <p>
                                {order.items.map((item, idx) => {
                                    if (idx === order.items.length - 1) {
                                        return item.name + " x" + item.quantity;
                                    } else {
                                        return item.name + " x" + item.quantity + ", ";
                                    }
                                })}
                            </p>
                            <p><b>Tổng tiền:</b> {order.amount?.toLocaleString()} VNĐ</p>
                            <p><b>Số món:</b> {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={() => trackOrder(order._id)}>Cập nhật trạng thái</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyOrders

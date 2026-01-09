import { createContext, useEffect, useState } from 'react'
import { food_list } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000"
  const url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([])
  const [loading, setLoading] = useState(true)

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
    }
    else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    }

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } })
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!")
        // Rollback on error
        if (!cartItems[itemId] || cartItems[itemId] === 1) {
          setCartItems((prev) => {
            const newCart = { ...prev }
            delete newCart[itemId]
            return newCart
          })
        } else {
          setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        }
      }
    }
  }

  const removeFromCart = async (itemId) => {
    const previousQuantity = cartItems[itemId]
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } })
      } catch (error) {
        console.error("Error removing from cart:", error)
        toast.error("Không thể cập nhật giỏ hàng. Vui lòng thử lại!")
        // Rollback on error
        setCartItems((prev) => ({ ...prev, [itemId]: previousQuantity }))
      }
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo && itemInfo.price) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  }

  const fetchFoodList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/food/list`)
      setFoodList(response.data.data)
    } catch (error) {
      console.error("Error fetching food list:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCartData = async (token) => {
    if (token) {
      try {
        const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } })
        setCartItems(response.data.cartData)
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList()
      const token = localStorage.getItem("token")
      if (token) {
        setToken(token)
      }
      await loadCartData(token)
    }
    loadData()
  }, [])

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loading
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider

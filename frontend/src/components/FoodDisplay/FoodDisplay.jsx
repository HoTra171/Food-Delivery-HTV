import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category = "All", foodItems, title = "Món ăn ngon gần bạn"}) => {
  const { food_list } = useContext(StoreContext)

  // Dùng foodItems được truyền vào, nếu không thì fallback về food_list trong context
  const displayList = foodItems || food_list

  return (
    <div className="food-display" id="food-display">
      <h2>{title}</h2>
      <div className="food-display-list">
        {displayList.map((item) => {
          if (category === "All" || category === item.category || foodItems) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null
        })}
      </div>
    </div>
  )
}

export default FoodDisplay

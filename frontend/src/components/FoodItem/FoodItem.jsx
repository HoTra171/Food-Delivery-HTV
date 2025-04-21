import React from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'

const FoodItem = ({id, name,price,description,image}) => {
    
  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img src={image} alt="" className="food-item-image" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <StarRating />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price} Nghìn Đồng</p>
      </div>
    </div>
  )
}

export default FoodItem

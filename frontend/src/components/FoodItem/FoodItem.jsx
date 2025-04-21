import React, {  useContext, useEffect } from 'react'
import './FoodItem.css'
import StarRating from '../StarRating/StarRating'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {faCircleMinus} from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({id, name,price,description,image}) => {
    
    const {cartItems, addToCart, removeFromCart} = useContext(StoreContext)

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img src={image} alt="" className="food-item-image" />
        {!cartItems[id]
            ?<div className="add" onClick={() => addToCart(id)}>    
                <FontAwesomeIcon icon={faPlus} />
            </div>
            :<div className='food-item-counter'>
                <FontAwesomeIcon icon={faCircleMinus} style={{color: "green", fontSize: "25px"}} onClick={() => removeFromCart(id)}/>
                <p style={{fontSize: "20px"}}>{cartItems[id]}</p>
                <FontAwesomeIcon icon={faCirclePlus} style={{color: "red", fontSize: "25px", }} onClick={() => addToCart(id)}  />
            </div>
        }
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

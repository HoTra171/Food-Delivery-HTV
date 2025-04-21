import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className="explore-menu" id='explore-menu'>
        <h1>Bộ sưu tập món ăn</h1>
        <p className='explore-menu-text'>Khám phá thực đơn đa dạng với những món nước truyền thống, được chế biến từ nguyên liệu tươi ngon mỗi ngày.</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index) => {
                return(
                    <div onClick={() => setCategory(prev => prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="menu"/>
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu

import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext';


const Navbar = ({setShowLogin}) => {
  
  const [menu, setMenu] = useState('menu')

  const {getTotalCartAmount} = useContext(StoreContext)

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo_1} alt="logo" className='logo' /></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === 'home'?'active':''}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === 'menu'?'active':''}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === 'mobile-app'?'active':''}>Mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === 'contact-us'?'active':''}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon'/>
        <div className="navbar-cart-icon">
          <Link to='/cart'><FontAwesomeIcon icon={faBagShopping}/></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        <button onClick={() => {setShowLogin(true)}}>sign in</button>
      </div>
    </div>
  )
}

export default Navbar

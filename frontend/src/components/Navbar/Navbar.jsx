import { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState('menu')
  const [searchTerm, setSearchTerm] = useState('')
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
  const navigate = useNavigate()

  const logout = () => {
    setToken("")
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <div className="navbar">
      <div className='navbar-container'>
        <Link to='/'><img src={assets.logo_1} alt="logo" className='logo' /></Link>
        <ul className='navbar-menu'>
          <Link to='/' onClick={() => setMenu("home")} className={menu === 'home' ? 'active' : ''}>Home</Link>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === 'menu' ? 'active' : ''}>Menu</a>
          <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-app</a>
          <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
        </ul>
        <div className="navbar-right">
          <div className="narbar-right-search">
          {/* <input
            type="text"
            placeholder="Tìm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon' />
          </div>
          <div className="navbar-cart-icon">
            <Link to='/cart'><FontAwesomeIcon icon={faBagShopping} /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>
          {!token ? <button onClick={() => { setShowLogin(true) }}>sign in</button>
            : <div className="navbar-profile">
              <FontAwesomeIcon icon={faCircleUser} className='nav-profile-icon' />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/myorders')}><FontAwesomeIcon icon={faBagShopping} className='profile-dropdown-icon' /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} className='profile-dropdown-icon' /><p>logout</p></li>
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar

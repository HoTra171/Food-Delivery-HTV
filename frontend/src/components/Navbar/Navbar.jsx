import { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faMagnifyingGlass, faCircleUser, faRightFromBracket, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState('menu')
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)

  const [activeMenu, setActiveMenu] = useState("home")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef(null)

  const navigate = useNavigate()

  const logout = () => {
    setToken("")
    localStorage.removeItem("token")
    navigate("/")
  }

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Focus input when expanding
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 150)
    } else {
      // Clear search when collapsing
      setSearchTerm("")
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchExpanded(false);
      setSearchTerm("");
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        const searchContainer = searchInputRef.current.closest(".search-container")
        if (searchContainer && !searchContainer.contains(event.target)) {
          setIsSearchExpanded(false)
          setSearchTerm("")
        }
      }
    }

    if (isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchExpanded])


  return (
    <div className="navbar">
      <div className='navbar-container'>
        <Link to='/'><img src={assets.logo_1} alt="logo" className='logo' /></Link>
        {!isSearchExpanded && (
          <ul className="navbar-menu">
            <Link to='/' onClick={() => setMenu("home")} className={menu === 'home' ? 'active' : ''}>Home</Link>
            <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === 'menu' ? 'active' : ''}>Menu</a>
            <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === 'mobile-app' ? 'active' : ''}>Mobile-app</a>
            <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === 'contact-us' ? 'active' : ''}>Contact us</a>
          </ul>
        )}
        <div className="navbar-right">
          <div className="search-container">
            <div className={`search-wrapper ${isSearchExpanded ? "expanded" : ""}`}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-input-container">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`search-input ${isSearchExpanded ? "visible" : "hidden"}`}
                  />
                  <button
                    type={isSearchExpanded ? "submit" : "button"}
                    onClick={!isSearchExpanded ? handleSearchToggle : undefined}
                    className="search-button"
                  >
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className='search-icon'
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Cart */}
          <div className="navbar-cart-icon">
            <Link to='/cart'><FontAwesomeIcon icon={faBagShopping} /></Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {/* User Authentication */}
          {!token ? <button className='btn-signIn' onClick={() => { setShowLogin(true) }}>sign in</button>
            : <div className="navbar-profile">
              <FontAwesomeIcon icon={faCircleUser} className='nav-profile-icon' />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate('/myorders')}><FontAwesomeIcon icon={faBagShopping} className='profile-dropdown-icon' /><p>Orders</p></li>
                <hr />
                <li onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} className='profile-dropdown-icon' /><p>logout</p></li>
              </ul>
            </div>
          }

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FontAwesomeIcon icon={faXmark} className='menu-icon' /> : <FontAwesomeIcon icon={faBars} className='menu-icon' />}
          </button>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu" role="navigation" aria-label="Menu di động">
              <div className="mobile-menu-content">
                <Link
                  to="/"
                  onClick={() => {
                    setActiveMenu("home")
                    setIsMobileMenuOpen(false)
                  }}
                  className={`mobile-nav-link ${activeMenu === "home" ? "active" : ""}`}
                >
                  Trang chủ
                </Link>
                <a
                  href="#explore-menu"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveMenu("menu")
                    setIsMobileMenuOpen(false)
                    document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`mobile-nav-link ${activeMenu === "menu" ? "active" : ""}`}
                >
                  Thực đơn
                </a>
                <a
                  href="#app-download"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveMenu("mobile-app")
                    setIsMobileMenuOpen(false)
                    document.getElementById('app-download')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`mobile-nav-link ${activeMenu === "mobile-app" ? "active" : ""}`}
                >
                  Ứng dụng
                </a>
                <a
                  href="#footer"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveMenu("contact-us")
                    setIsMobileMenuOpen(false)
                    document.querySelector('.footer')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`mobile-nav-link ${activeMenu === "contact-us" ? "active" : ""}`}
                >
                  Liên hệ
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

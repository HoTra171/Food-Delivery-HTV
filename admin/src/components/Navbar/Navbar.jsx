import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <div>
        <div className="navbar">
            <img className='logo' src={assets.logo} alt="" />
            <FontAwesomeIcon icon={faCircleUser} className='profile'/>
        </div>
    </div>
  )
}

export default Navbar

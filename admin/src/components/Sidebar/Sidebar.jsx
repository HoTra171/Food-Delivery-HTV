import React from 'react'
import './Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faRectangleList } from '@fortawesome/free-solid-svg-icons'
import { faTableList } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
      <div className="sidebar">
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <FontAwesomeIcon icon={faCirclePlus} className='icon'/>
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <FontAwesomeIcon icon={faRectangleList} className='icon'/>
                <p>List Items</p>
            </NavLink>
            <NavLink to='orders' className="sidebar-option">
                <FontAwesomeIcon icon={faTableList} className='icon'/>
                <p>Orders</p>
            </NavLink>
        </div>
      </div>
  )
}

export default Sidebar

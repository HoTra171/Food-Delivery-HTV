import React from 'react'
import './Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faRectangleList } from '@fortawesome/free-solid-svg-icons'
import { faTableList } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  return (
    <div>
      <div className="sidebar">
        <div className="sidebar-options">
            <div className="sidebar-option">
                <FontAwesomeIcon icon={faCirclePlus} />
                <p>Add Items</p>
            </div>
            <div className="sidebar-option">
                <FontAwesomeIcon icon={faRectangleList} />
                <p>List Items</p>
            </div>
            <div className="sidebar-option">
                <FontAwesomeIcon icon={faTableList} />
                <p>Orders</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

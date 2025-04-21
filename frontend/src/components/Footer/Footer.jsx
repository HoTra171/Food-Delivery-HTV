import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo_1} alt="logo" />
            <p>HVT Food Deli là nội dung mẫu đại diện cho một thương hiệu giao đồ ăn hiện đại. Kể từ năm 2020, HVT Food Deli đã trở thành lựa chọn hàng đầu cho những bữa ăn nhanh, tươi và ngon miệng. Ra đời từ niềm đam mê ẩm thực tiện lợi, thương hiệu vẫn luôn đồng hành cùng bữa ăn hàng ngày của bạn.</p>
            <div className="footer-social-icons">
                <FontAwesomeIcon className='icon' icon={faFacebook} />
                <FontAwesomeIcon className='icon' icon={faInstagram} />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Công ty</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Liên hệ</h2>
            <ul>
                <li>+84 123456789</li>
                <li>fdhtv@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 &copy; HVT.com - All Right Reverved.</p>
    </div>
  )
}

export default Footer

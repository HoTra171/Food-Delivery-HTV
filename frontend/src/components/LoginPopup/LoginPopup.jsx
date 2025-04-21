import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './LoginPopup.css'

const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState] = useState("Login")

  return (
    <div className='login-popup'>
      <form className='login-popup-container'>
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <FontAwesomeIcon icon={faXmark} className='img' onClick={() => {setShowLogin(false)}}/>
        </div>
        <div className="login-popup-inputs">
            {currState==='Login'?<></>:<input type='text' placeholder='Your Name' required/>}
            <input type="email" placeholder='Your Email' required />
            <input type="password" placeholder='Password' required />
        </div>
        <button>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p>Bằng việc tiếp tục, tôi đồng ý với <a href="#terms-of-use" style={{color: "tomato"}}>điều khoản sử dụng</a> và <a href="#privacy-policy" style={{color: "tomato"}}>chính sách bảo mật</a>.</p>
        </div>
        {currState==="Login"
        ?<p>Tạo tài khoản mới?<span onClick={() => setCurrState("Sign Up")}>Click vào đây</span></p>
        :<p>Bạn đã có tài khoản?<span onClick={() => setCurrState("Login")}>Đăng nhập tại đây</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup

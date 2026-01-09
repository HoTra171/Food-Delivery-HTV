import React, { useState,useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './LoginPopup.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext)

    const [currState,setCurrState] = useState("Login")
    const [data,setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setData((prev) => ({...prev, [name]: value}))
    }

    const onLogin = async (e) => {
      e.preventDefault()
      let newUrl = url
      if(currState==="Login"){
        newUrl += `/api/user/login`
      }else{
        newUrl += `/api/user/register`
      }

      try {
        const response = await axios.post(newUrl, data)

        if(response.data.success){
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
          setShowLogin(false)
          toast.success(currState === "Login" ? "Đăng nhập thành công!" : "Đăng ký thành công!")
        }
        else{
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại!")
        console.error("Login error:", error)
      }
    }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <FontAwesomeIcon icon={faXmark} className='img' onClick={() => {setShowLogin(false)}}/>
        </div>
        <div className="login-popup-inputs">
            {currState==='Login'?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your Name' required/>}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
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

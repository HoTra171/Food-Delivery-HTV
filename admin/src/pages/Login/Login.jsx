import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Login = ({ url, setToken }) => {

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post(`${url}/api/user/login`, data)

            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                toast.success("Đăng nhập thành công")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi đăng nhập")
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Admin Panel Login</h2>
                </div>
                <div className="login-popup-inputs">
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login

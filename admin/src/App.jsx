import React, { useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Orders from './pages/Orders/Orders'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import RevenueReport from './pages/RevenueReport/RevenueReport'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';


const App = () => {

  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const [token, setToken] = React.useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token])

  return (
    <div>
      <ToastContainer />
      {token === ""
        ? <Login url={url} setToken={setToken} />
        : <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/reports" element={<RevenueReport url={url} />} />
            </Routes>
          </div>
        </>
      }
    </div>
  )
}

export default App

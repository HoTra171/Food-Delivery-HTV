import React, { useState, useContext } from 'react'
import './Home.css'
import Header from  '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton'
import { StoreContext } from '../../context/StoreContext'

const Home = () => {
  const [category, setCategory] = useState('All')
  const { loading } = useContext(StoreContext)

  return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        {loading ? (
          <div style={{ padding: '0 8vw' }}>
            <h2 style={{ fontSize: 'max(2vw,24px)', fontWeight: 600, marginTop: 30 }}>
              Món ăn ngon gần bạn
            </h2>
            <LoadingSkeleton type="food-item" count={8} />
          </div>
        ) : (
          <FoodDisplay category={category} />
        )}
        <AppDownload />
    </div>
  )
}

export default Home

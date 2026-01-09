import React, { useContext, useState, useEffect } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import SearchFilter from '../SearchFilter/SearchFilter'

const FoodDisplay = ({ category = "All", foodItems, title = "Món ăn ngon gần bạn", showSearch = true }) => {
  const { food_list } = useContext(StoreContext)

  // Dùng foodItems được truyền vào, nếu không thì fallback về food_list trong context
  const baseList = foodItems || food_list

  const [filteredList, setFilteredList] = useState(baseList)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortType, setSortType] = useState('default')

  useEffect(() => {
    // Start with the base list
    let result = [...baseList]

    // Apply category filter only if foodItems is not provided (meaning we're using the global food_list)
    if (!foodItems) {
      if (category && category !== "All") {
        result = result.filter(item => item.category === category)
      }
    }

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim()
      result = result.filter(item =>
        item.name?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    switch (sortType) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name-asc':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-desc':
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      default:
        // Keep default order
        break
    }

    setFilteredList(result)
  }, [baseList, category, searchTerm, sortType, foodItems])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleSort = (type) => {
    setSortType(type)
  }

  return (
    <div className="food-display" id="food-display">
      <h2>{title}</h2>

      {showSearch && (
        <SearchFilter onSearch={handleSearch} onSort={handleSort} />
      )}

      {filteredList.length === 0 ? (
        <div className="no-results">
          <p>Không tìm thấy món ăn phù hợp</p>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay

import { useState } from 'react'
import './SearchFilter.css'

const SearchFilter = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleSort = (e) => {
    onSort(e.target.value)
  }

  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="sort-box">
        <label htmlFor="sort">Sắp xếp: </label>
        <select id="sort" onChange={handleSort} className="sort-select">
          <option value="default">Mặc định</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
        </select>
      </div>
    </div>
  )
}

export default SearchFilter

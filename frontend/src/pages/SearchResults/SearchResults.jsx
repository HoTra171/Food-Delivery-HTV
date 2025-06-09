import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx';
import './SearchResults.css'

const SearchResults = () => {
    const { food_list } = useContext(StoreContext); 
    const query = new URLSearchParams(useLocation().search);
    const keyword = query.get("keyword")?.toLowerCase() || "";

    const filteredItems = food_list.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );

    return (
        <div className="search-results container">
            <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
            {filteredItems.length === 0 ? (
                <p>Không tìm thấy món ăn phù hợp.</p>
            ) : (
                <FoodDisplay title={""} foodItems={filteredItems} />
            )}
        </div>
    )
}

export default SearchResults

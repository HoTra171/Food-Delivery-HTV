import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx';
import './SearchResults.css'

const SearchResults = () => {
    const { food_list, loading } = useContext(StoreContext);
    const query = new URLSearchParams(useLocation().search);
    const keyword = query.get("keyword")?.toLowerCase() || "";
    const navigate = useNavigate();

    const filteredItems = food_list.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword)
    );

    if (loading) {
        return (
            <div className="search-results container">
                <div className="search-loading">
                    <p>Đang tìm kiếm...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="search-results container">
            <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
            {filteredItems.length === 0 ? (
                <div className="empty-search">
                    <h3>Không tìm thấy món ăn phù hợp</h3>
                    <p>Không có món ăn nào khớp với từ khóa "{keyword}"</p>
                    <button onClick={() => navigate('/')} className="btn-back-home">
                        Về trang chủ
                    </button>
                </div>
            ) : (
                <>
                    <p className="search-count">{filteredItems.length} món ăn được tìm thấy</p>
                    <FoodDisplay title={""} foodItems={filteredItems} />
                </>
            )}
        </div>
    )
}

export default SearchResults

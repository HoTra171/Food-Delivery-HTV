import './LoadingSkeleton.css'

const LoadingSkeleton = ({ type = 'food-item', count = 8 }) => {
  if (type === 'food-item') {
    return (
      <div className="food-display-list">
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className="skeleton-food-item">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'order-card') {
    return (
      <div className="skeleton-orders">
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className="skeleton-order-card">
            <div className="skeleton-order-header"></div>
            <div className="skeleton-order-items"></div>
            <div className="skeleton-order-footer"></div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default LoadingSkeleton

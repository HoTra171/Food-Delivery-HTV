import { useState } from "react"
import { Star } from "lucide-react"
import "./StarRating.css"

function StarRating() {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`star ${star <= hoveredRating || star <= selectedRating ? "star-active" : ""}`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setSelectedRating(star)}
          />
        ))}
      </div>
    </div>
  )
}

export default StarRating

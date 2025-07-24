function StarRatingDisplay({ rating }) {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa-star fa${star <= rating ? "s" : "r"}`}
                    style={{ color: star <= rating ? "gold" : "gray", marginRight: 3 }}
                ></i>
            ))}
        </div>
    );
}
export default StarRatingDisplay;

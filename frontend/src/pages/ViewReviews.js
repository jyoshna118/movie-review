import { useEffect, useState } from "react";
import "../styles/ReviewPage.css";

function ViewReviews({ movieId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/${movieId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Expected array but got:", data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err);
        setReviews([]);
      });
  }, [movieId]);

  return (
    <div className="user-reviews">
      <h3>User Reviews</h3>
      {Array.isArray(reviews) && reviews.length > 0 ? (
        <ul className="user-reviews-list">
          {reviews.map((rev, i) => (
            <li key={i} className="review-item">
              <strong>⭐ {rev.rating}/5</strong>
              <p>{rev.comment}</p>
              <small>by {rev.user?.username || "Anonymous"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet. Be the first to write one!</p>
      )}
    </div>
  );
}

export default ViewReviews;

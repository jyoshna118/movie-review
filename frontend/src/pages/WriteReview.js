import axios from 'axios'
import { useState } from "react";
import "../styles/ReviewPage.css";

function WriteReview({ movieId }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!rating || !comment) {
      alert("Both rating and comment are required.");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/movies/${movieId}/reviews`,
        {
          rating: Number(rating),
          comment: comment.trim(), 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted!");
      setRating("");
      setComment("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Submit Your Review</h3>
      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1–5)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="form-input"
        required
      />
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="form-input"
        rows={4}
        required
      />
      <button type="submit" className="nav-button blue">
        Submit Review
      </button>
    </form>
  );
}

export default WriteReview;

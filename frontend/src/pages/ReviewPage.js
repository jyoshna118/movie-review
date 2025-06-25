// src/pages/ReviewPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ReviewPage.css";

function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched movie:", data); // ✅ See what’s returned
        setMovie(data);
        setReviews(data.reviews || []);
      })
      .catch((err) => console.error("Error fetching movie:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Please login first.");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/movies/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(rating), comment: text }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Review submitted!");
        setRating("");
        setText("");
        setReviews([...reviews, data.review]);
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="review-page">
      <div className="review-header">
        <h2>🎬 Movie Reviews</h2>
        <div>
          <button className="nav-button blue" onClick={() => navigate("/")}>Back to Home</button>
          <button className="nav-button gray" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>

      <div className="review-body">
        <div className="poster-section">
          {movie ? (
            <>
              <img
                src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
                alt={movie.title}
                className="movie-poster"
              />
              <p><strong>Release Year:</strong> {movie.releaseYear || "N/A"}</p>
              <p><strong>Avg Rating:</strong> {movie.averageRating || "N/A"}</p>
            </>
          ) : (
            <p>Loading movie...</p>
          )}
        </div>

        <div className="review-section">
          <form onSubmit={handleSubmit}>
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-input"
              rows={4}
              required
            />
            <button type="submit" className="nav-button blue">Submit Review</button>
          </form>

          <div className="user-reviews">
            <h3>User Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet. Be the first to write one!</p>
            ) : (
              <ul className="user-reviews-list">
                {reviews.map((rev, i) => (
                  <li key={i}>
                    <strong>⭐ {rev.rating}/5</strong>
                    <p>{rev.comment}</p>
                    <small>by {rev.user?.username || "Anonymous"}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;

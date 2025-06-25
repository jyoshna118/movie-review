import React from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie }) {
  const navigate = useNavigate();
  console.log("Poster URL:", movie.posterUrl);


  return (
    <div className="movie-card">
     <img
  src={
    movie.posterUrl && movie.posterUrl.trim() !== ""
      ? movie.posterUrl
      : "https://via.placeholder.com/300x450?text=No+Image"
  }
  alt={movie.title}
  className="movie-poster"
/>

      <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
      <p className="text-sm text-gray-600">Year: {movie.releaseYear}</p>
      <p className="text-sm text-yellow-600">
        Rating: {movie.averageRating?.toFixed(1) || "N/A"}
      </p>

      <button
        className="view-review-btn"
        onClick={() => navigate(`/reviews/${movie._id}`)}
      >
        View Reviews
      </button>
    </div>
  );
}

export default MovieCard;

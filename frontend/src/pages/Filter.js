import React, { useState, useEffect } from "react";
import axios from 'axios'
import MovieCard from "../components/MovieCard";
import "../styles/App.css"; // Ensure this contains .movie-grid, etc.

function Filter() {
  const [rating, setRating] = useState(4); // default: 4 stars and above
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/movies/filter/${rating}`)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("❌ Filter fetch error:", err));
  }, [rating]);

  return (
    <div className="top-rated-container">
      <h2 className="section-title">Filter Movies by Rating</h2>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="basic-button"

      >
        <option value="1">1 star & above</option>
        <option value="2">2 stars & above</option>
        <option value="3">3 stars & above</option>
        <option value="4">4 stars & above</option>
        <option value="5">5 stars only</option>
        <option value="0">0 star</option>
      </select>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Filter;

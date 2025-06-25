// src/pages/TopRated.js
import React, { useEffect, useState } from "react";
import axios from 'axios'
import MovieCard from "../components/MovieCard";
import "../styles/App.css"; // Ensure this exists and includes grid styles

function TopRated() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies/top-rated`).then((res) => {
      setMovies(res.data);
    });
  }, []);

  return (
    <div className="top-rated-container">
      <h2 className="section-title">Top 10 Highest Rated Movies</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default TopRated;

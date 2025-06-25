// src/pages/Oldest.js
import React, { useEffect, useState } from "react";
import axios from 'axios'
import MovieCard from "../components/MovieCard";
import "./Oldest.css"; 

function Oldest() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies/oldest`).then((res) => {
      setMovies(res.data);
    });
  }, []);

  return (
    <div className="oldest-container">
      <h2 className="oldest-title">10 Oldest Movies</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Oldest;

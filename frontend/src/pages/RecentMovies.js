import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import "./RecentMovies.css"; 

function RecentMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/movies/recent`)
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("Error fetching recent movies:", err));
  }, []);

  return (
    <div className="recent-movies-container">
      <h2 className="recent-title">Recent Movies</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default RecentMovies;

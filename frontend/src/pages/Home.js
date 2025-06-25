import React, { useEffect, useState } from "react";
import axios from 'axios'
import MovieCard from "../components/MovieCard";
import './Home.css';


function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies`).then((res) => {
          console.log("🔍 Movie data from backend:", res.data);  // ADD THIS

      setMovies(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Movies</h2>
        <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;

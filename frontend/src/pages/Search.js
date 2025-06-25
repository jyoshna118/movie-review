import React, { useEffect, useState } from "react";
import axios from 'axios'
import MovieCard from "../components/MovieCard";
import "../styles/search.css"; // Add this for custom styling

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        axios
          .get(`${process.env.REACT_APP_API_URL}/movies/search/${query}`)
          .then((res) => {
            setResults(res.data);
          });
      } else {
        setResults([]); // clear when no query
      }
    }, 300); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="search-page">
      <h2 className="search-title">🎬 Search Movies</h2>

      <input
        type="text"
        placeholder="Enter movie title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <div className="search-results">
        {results.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Search;

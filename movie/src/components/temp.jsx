// src/components/MovieSearch.jsx
import React, { useState } from "react";
import axios from "axios";
import "./MovieSearch.css";

const MovieSearch = () => {
  const [movieData, setMovieData] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("");

  // 1. Search movies by query
  const searchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get("http://www.omdbapi.com/", {
        params: {
          s: query,
          apikey: import.meta.env.VITE_API_KEY,
        },
      });
      if (response.data.Error) throw new Error(response.data.Error);
      setMovieList(response.data.Search || []);
      setMovieData(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Get full movie details by title
  const getMovieDetails = async (title) => {
    setLoading(true);
    try {
      const response = await axios.get("http://www.omdbapi.com/", {
        params: {
          t: title,
          plot: "full",
          apikey: import.meta.env.VITE_API_KEY,
        },
      });
      if (response.data.Error) throw new Error(response.data.Error);
      setMovieData(response.data);
      setMovieList([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Get movie by IMDb ID (for cast info)
  const getMovieById = async (imdbID) => {
    setLoading(true);
    try {
      const response = await axios.get("http://www.omdbapi.com/", {
        params: {
          i: imdbID,
          apikey: import.meta.env.VITE_API_KEY,
        },
      });
      if (response.data.Error) throw new Error(response.data.Error);
      setMovieData(response.data);
      setMovieList([]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Search movies by rating (Note: OMDB doesn't have direct rating filter, so we filter client-side)
  const searchByRating = async (query, rating) => {
    setLoading(true);
    try {
      const response = await axios.get("http://www.omdbapi.com/", {
        params: {
          s: query,
          apikey: import.meta.env.VITE_API_KEY,
        },
      });
      if (response.data.Error) throw new Error(response.data.Error);
      const filtered = (response.data.Search || []).filter(movie => 
        movie.Rated === rating
      );
      setMovieList(filtered);
      setMovieData(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Get top movies by language (simulated as OMDB doesn't have ranking)
  const getTopMoviesByLanguage = async (lang) => {
    setLoading(true);
    try {
      const response = await axios.get("http://www.omdbapi.com/", {
        params: {
          s: lang,
          apikey: import.meta.env.VITE_API_KEY,
        },
      });
      if (response.data.Error) throw new Error(response.data.Error);
      const topMovies = (response.data.Search || []).slice(0, 10);
      setMovieList(topMovies);
      setMovieData(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMovies(searchQuery); // Endpoint 1
      // getMovieDetails(searchQuery); // Endpoint 2
      // searchByRating(searchQuery, "PG-13"); // Endpoint 4 example
    }
  };

  const handleLanguageSearch = (e) => {
    e.preventDefault();
    if (language.trim()) {
      getTopMoviesByLanguage(language);
    }
  };

  return (
    <div className="movie-search-container">
      <h1>Movie Database Explorer</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies..."
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Language Search */}
      <form onSubmit={handleLanguageSearch} className="language-form">
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Enter language (e.g., English)"
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          Get Top 10
        </button>
      </form>

      {error && <p className="error-message">Error: {error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      {/* Movie List Display */}
      {movieList.length > 0 && !loading && (
        <div className="movie-list">
          <h2>Search Results:</h2>
          <ul>
            {movieList.map((movie) => (
              <li key={movie.imdbID} onClick={() => getMovieById(movie.imdbID)}>
                {movie.Title} ({movie.Year})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Movie Details Display */}
      {movieData && !loading && (
        <div className="movie-details">
          <h2>{movieData.Title}</h2>
          <p><strong>Year:</strong> {movieData.Year}</p>
          <p><strong>Rating:</strong> {movieData.Rated}</p>
          <p><strong>Actors:</strong> {movieData.Actors}</p>
          <p><strong>Director:</strong> {movieData.Director}</p>
          <p><strong>Plot:</strong> {movieData.Plot}</p>
          
          {/* Top Directors and Actors (extracted from data) */}
          <div className="top-personnel">
            <h3>Key Personnel</h3>
            <p><strong>Top Director:</strong> {movieData.Director.split(',')[0]}</p>
            <p><strong>Top Actor:</strong> {movieData.Actors.split(',')[0]}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
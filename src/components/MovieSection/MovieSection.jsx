import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./MovieSection.css"
import placeholder from "../../assets/placeholder.webp"
import playIcon from "../../assets/play_icon.png"
import { fetchTrendingMovies, searchMovies } from '../../services/movieService'
import { useSearch } from '../../context/SearchContext';
import Pagination from '../Pagination/Pagination'

const MovieSkeleton = () => (
  <article className="movie-skeleton">
    <div className="skeleton-wrapper">
      <div className="skeleton-poster" />
      <div className="skeleton-info">
        <div>
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
        <div className="skeleton-button" />
      </div>
    </div>
  </article>
);

const NoResults = () => (
  <div className="no-results">
    <i className="fa-solid fa-video-slash"></i>
    <p>No movies found</p>
  </div>
);

const MovieSection = ({ title = "Trending" }) => {
  const navigate = useNavigate();
  const { searchQuery, isSearching } = useSearch();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        let data;
        
        if (isSearching && searchQuery.trim()) {
          data = await searchMovies(searchQuery, currentPage);
        } else {
          data = await fetchTrendingMovies(currentPage);
        }

        setMovies(data.movies);
        setTotalPages(Math.min(data.totalPages, 250)); // TMDB limits to 250 pages
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error loading movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(loadMovies, 300);
    return () => clearTimeout(debounceTimeout);
  }, [currentPage, searchQuery, isSearching]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const renderStars = (rating) => {
    // Convert TMDB rating (0-10) to our scale (0-5)
    const convertedRating = rating / 2;
    const stars = [];

    // Add 5 stars total
    for (let i = 0; i < 5; i++) {
      const starValue = Math.min(Math.max(convertedRating - i, 0), 1);

      if (starValue >= 1) {
        // Full star
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFE234"/>
          </svg>
        );
      } else if (starValue > 0) {
        // Half star
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
            <defs>
              <clipPath id={`half-${i}`}>
                <rect x="0" y="0" width="7.5" height="14" />
              </clipPath>
            </defs>
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#E0E0E0"/>
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFE234" clipPath={`url(#half-${i})`}/>
          </svg>
        );
      } else {
        // Empty star
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#E0E0E0"/>
          </svg>
        );
      }
    }
    return stars;
  };

  const displayTitle = isSearching && searchQuery.trim() 
    ? `Search results for "${searchQuery}"`
    : title;

  if (isLoading) {
    return (
      <section className="content-section">
        <h2 className="section-title">{displayTitle}</h2>
        <div className="movie-grid">
          {[...Array(8)].map((_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content-section">
        <h2 className="section-title">{displayTitle}</h2>
        <div className="error-state">{error}</div>
      </section>
    );
  }

  return (
    <section className="content-section">
      <h2 className={title === "Trending" ? "section-title" : "section-title full-height"}>
        {displayTitle}
      </h2>
      {movies.length === 0 ? (
        <NoResults />
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <article key={movie.id} className="movie-item">
              <div className="movie-wrapper">
                <div className="poster-container">
                  <img 
                    src={movie.posterPath || placeholder} 
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.src = placeholder;
                    }}
                  />
                </div>
                <div className="movie-info">
                  <div className="info-wrapper">
                    <h3 className="movie-title">
                      {movie.title}
                      <span className="title-tooltip">{movie.title}</span>
                    </h3>
                    <div className="rating-container">
                      <div className="star-rating">
                        {renderStars(movie.rating)}
                      </div>
                      <p className="rating-text">{(movie.rating / 2).toFixed(1)} / 5</p>
                    </div>
                  </div>
                  <button 
                    className="play-button"
                    onClick={() => handlePlayClick(movie.id)}
                  >
                    <img src={playIcon} alt="Play" className="play-icon" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  )
}

export default MovieSection

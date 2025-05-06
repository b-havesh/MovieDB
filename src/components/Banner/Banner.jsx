import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <section className="movie-banner-section">
      <div className="movie-banner-container">
        <div className="movie-banner-content">
          <h1 className="movie-banner-title">Welcome to MovieStream</h1>
          <p className="movie-banner-description">
            Discover thousands of movies and TV shows, all in one place
          </p>
          <button className="movie-banner-cta">
            Start Watching
          </button>
        </div>
        <div className="movie-banner-overlay"></div>
      </div>
    </section>
  );
};

export default Banner;
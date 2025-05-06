import React from 'react';
import './MovieList.css';

const MovieList = () => {
  // Sample movie data - in a real app, this would come from an API
  const movies = [
    {
      id: 1,
      title: 'Sample Movie 1',
      rating: 4.5,
      imageUrl: 'https://via.placeholder.com/300x450',
    },
    {
      id: 2,
      title: 'Sample Movie 2',
      rating: 4.8,
      imageUrl: 'https://via.placeholder.com/300x450',
    },
    // Add more sample movies as needed
  ];

  return (
    <section className="movie-list-section">
      <div className="movie-list-container">
        <h2 className="movie-list-title">Popular Movies</h2>
        <div className="movie-list-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-card-image">
                <img src={movie.imageUrl} alt={movie.title} />
                <div className="movie-card-overlay">
                  <button className="movie-card-play">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="movie-card-content">
                <h3 className="movie-card-title">{movie.title}</h3>
                <div className="movie-card-rating">
                  <svg className="movie-card-star" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" fill="currentColor"/>
                  </svg>
                  <span>{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieList; 
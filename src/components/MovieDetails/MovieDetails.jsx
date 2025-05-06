import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieVideos } from '../../services/movieService';
import './MovieDetails.css';
import playIcon from "../../assets/play_icon_details.svg";
import backIcon from "../../assets/back_icon.svg";
import closeIcon from "../../assets/close.svg";
import placeholderImage from "../../assets/Image_not_available.png";
import Toast from "../Toast/Toast";

const VideoPopup = ({ videoKey, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="video-popup-overlay" onClick={onClose}>
      <div className="video-popup-content" onClick={e => e.stopPropagation()}>
        <button className="video-popup-close" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 550);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 550);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [movieData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieVideos(id)
        ]);

        if (!movieData || !movieData.id) {
          navigate('/404', { replace: true });
          return;
        }

        setMovie(movieData);
        
        // Find the first trailer or teaser
        const trailerVideo = videosData.results?.find(
          video => video.type === "Trailer" || video.type === "Teaser"
        );
        setTrailer(trailerVideo);
      } catch (err) {
        if (err.message.includes('404') || err.message.includes('not found')) {
          navigate('/404', { replace: true });
        } else {
          setError('Failed to load movie details. Please try again later.');
        }
        console.error('Error loading movie details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovieDetails();
  }, [id, navigate]);

  const handlePlayClick = () => {
    setShowTrailer(true);
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
  };

  if (isLoading) {
    return <div className="loadingBackground"></div>;
  }

  if (error) {
    return (
      <>
        <div className="loadingBackground"></div>
        <Toast message={error} type="error" onClose={() => setError(null)} />
      </>
    );
  }

  if (!movie) {
    navigate('/404', { replace: true });
    return null;
  }

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
              <clipPath id={`half-detail-${i}`}>
                <rect x="0" y="0" width="7.5" height="14" />
              </clipPath>
            </defs>
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#E0E0E0"/>
            <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#FFE234" clipPath={`url(#half-detail-${i})`}/>
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

  if (isMobile) {
    return (
      <>
        <section className="mobileDetails">
          <div className="mobileDetailsContainer">
            <div className="mobileMovieDetailsImage">
              <img 
                src={movie.backdropPath || placeholderImage} 
                alt={movie.title}
                onError={handleImageError}
              />
            </div>
            <div className="movieDetailsContainer">
              <div className="movieDetails">
                <img 
                  className="leftArrow" 
                  src={backIcon} 
                  alt="back" 
                  onClick={handleBackClick}
                />
                <h3>{movie.title}</h3>
                <div className="rating-info">
                  <span>Rating: {(movie.rating / 2).toFixed(2)}/5</span>
                  {/* <div className="stars">{renderStars(movie.rating)}</div> */}
                </div>
                <p>{movie.overview}</p>
                <div className="moviereleaseSection">
                  <div className="releaseDate">
                    <h5>Release Date</h5>
                    <p>{new Date(movie.releaseDate).getFullYear()}</p>
                  </div>
                  <div className="language">
                    <h5>Original Language</h5>
                    <ul>
                      <li>{movie.language.toUpperCase()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {showTrailer && trailer && (
          <VideoPopup 
            videoKey={trailer.key} 
            onClose={() => setShowTrailer(false)} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <section 
        className="details" 
        style={{ 
          backgroundImage: `url(${movie.backdropPath || placeholderImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="container detailsContainer">
          <div className="movieDeatilsSection">
            <div>
              <img 
                src={backIcon} 
                alt="back" 
                onClick={handleBackClick}
              />
            </div>
            <div className="movieDetails">
              <h3>{movie.title}</h3>
              <div className="rating-info">
                <span>Rating: {(movie.rating / 2).toFixed(2)}/5</span>
                {/* <div className="stars">{renderStars(movie.rating)}</div> */}
              </div>
              <p>{movie.overview}</p>
            </div>
            <div className="moviereleaseSection">
              <div className="releaseDate">
                <h5>Release Date</h5>
                <p>{new Date(movie.releaseDate).getFullYear()}</p>
              </div>
              <div className="language">
                <h5>Original Language</h5>
                <ul>
                  <li>{movie.language.toUpperCase()}</li>
                </ul>
              </div>
            </div>
          </div>
          {trailer && (
            <div className="playButton" onClick={handlePlayClick}>
              <img 
                className="detailsPlayButton" 
                src={playIcon} 
                alt="playButton" 
              />
            </div>
          )}
        </div>
        <div className="Toastify"></div>
      </section>
      {showTrailer && trailer && (
        <VideoPopup 
          videoKey={trailer.key} 
          onClose={() => setShowTrailer(false)} 
        />
      )}
    </>
  );
};

export default MovieDetails;
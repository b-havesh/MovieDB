import { ENDPOINTS, constructUrl, IMAGE_BASE_URL, THUMBNAIL_SIZE, POSTER_SIZE } from './api';

export const fetchTrendingMovies = async (page = 1) => {
  try {
    const response = await fetch(constructUrl(ENDPOINTS.TRENDING, { page }));
    if (!response.ok) {
      throw new Error(`Failed to fetch trending movies: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      movies: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path 
          ? `${IMAGE_BASE_URL}/${THUMBNAIL_SIZE}${movie.poster_path}`
          : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        overview: movie.overview
      })),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(constructUrl(ENDPOINTS.MOVIE_DETAILS(movieId)));
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('404 Movie not found');
      }
      throw new Error(`Failed to fetch movie details: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      rating: data.vote_average,
      releaseDate: data.release_date,
      language: data.original_language,
      posterPath: data.poster_path 
        ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${data.poster_path}`
        : null,
      backdropPath: data.backdrop_path
        ? `${IMAGE_BASE_URL}/${POSTER_SIZE}${data.backdrop_path}`
        : null,
      runtime: data.runtime,
      genres: data.genres
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await fetch(constructUrl(ENDPOINTS.MOVIE_VIDEOS(movieId)));
    if (!response.ok) {
      throw new Error(`Failed to fetch movie videos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(constructUrl(ENDPOINTS.SEARCH, { query, page }));
    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      movies: data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path 
          ? `${IMAGE_BASE_URL}/${THUMBNAIL_SIZE}${movie.poster_path}`
          : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
        overview: movie.overview
      })),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
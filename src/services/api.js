export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes for tmdb
export const BACKDROP_SIZE = 'w1280';
export const POSTER_SIZE = 'w780';
export const THUMBNAIL_SIZE = 'w342';

// API endpoints
export const ENDPOINTS = {
  TRENDING: `${BASE_URL}/trending/movie/day`,
  SEARCH: `${BASE_URL}/search/movie`,
  MOVIE_DETAILS: (id) => `${BASE_URL}/movie/${id}`,
  MOVIE_VIDEOS: (id) => `${BASE_URL}/movie/${id}/videos`,
};

// Helper function to construct URLs with API key
export const constructUrl = (endpoint, queryParams = {}) => {
  const url = new URL(endpoint);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}; 
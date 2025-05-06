import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./Navbar.css";
import searchIcon from "../../assets/search.png"

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const { searchQuery, setSearchQuery, setIsSearching } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchTimeout = React.useRef(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search
    searchTimeout.current = setTimeout(() => {
      setIsSearching(query.length > 0);
    }, 500);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleLogoClick = () => {
    if (isAuthenticated) {
      setSearchQuery('');  // Clear search query
      setIsSearching(false);  // Reset search state
      navigate('/home');  // Navigate to home
    }
  };

  // Check if we're on the movie details page
  const isMovieDetailsPage = location.pathname.includes('/movie/');

  return (
    <header className="header">
      <nav className="nav-wrapper">
        <img 
          className="brand-logo" 
          src={logo} 
          alt="logo" 
          onClick={handleLogoClick}
        />
        {isAuthenticated && !isMovieDetailsPage && (
          <div className="nav-controls">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search movies"
                value={searchQuery}
                onChange={handleSearch}
              />
              <img
                src={searchIcon}
                alt="searchButton"
                className="search-icon"
              />
            </div>
            <button className="auth-button" onClick={logout}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

import React from "react";
import MovieSection from "../MovieSection/MovieSection";
import "./Home.css";

const Home = () => {
  return (
    <div className="movie-home">
      <div className="movie-banner"></div>
      <MovieSection />
    </div>
  );
};

export default Home;

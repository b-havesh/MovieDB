import React from 'react';
import Navbar from '../Navbar/Navbar';
import Banner from '../Banner/Banner';
import MovieSection from '../MovieSection/MovieSection';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <section className="movie-dashboard">
      <div className="movie-dashboard-container">
        <Navbar />
        <Banner />
        <MovieSection title="Trending Now" />
        <MovieSection title="Popular Movies" />
        <MovieSection title="New Releases" />
      </div>
    </section>
  );
};

export default Dashboard; 
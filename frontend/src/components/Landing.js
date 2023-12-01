import React from 'react';
import '../styles/landing.css';
import Navbar from './Navbar';
import User from './User';

const Landing = () => {
  // Retrieve username from local storage
  const username = localStorage.getItem('username');

  return (
    <div>
      <Navbar username={username} />
      <User username={username} />
    </div>
  );
};

export default Landing;
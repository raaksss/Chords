import React from 'react';
import '../styles/signup.css';

const AuthSpot = () => {
  const handleLoginClick = () => {
    const client_id = '84fad8cd66834378b3336e18558015cf';
    const redirect_uri = 'http://localhost:3000/signup';
    const url = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
        response_type: 'token',
        client_id,
        redirect_uri,
    });

    window.location.href = `${url}?${params.toString()}`;
};

      
  return (
    <div id="content">
      <div id="login-container">
        <div className="login">
          <h1>Are you new here?</h1>
          <button id="login-button" className="big-btn" onClick={handleLoginClick}>
            Log in with Spotify
          </button>
          <p className="login-desc">Please link your Spotify Account.</p>
          <p className="login-desc-small">You will automatically be redirected to the sign-up page.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthSpot;

import React from 'react';
import '../styles/signup.css';

const AuthSpot = () => {
  const handleLoginClick = () => {
    // const client_id = '8f60010d6bb34cd8a962ffe17d865fa1';
    const client_id = 'c8f7899b69aa4f17a3ce3f0b60dd510b';
    const redirect_uri = 'http://localhost:3000/signup';
    const url = 'https://accounts.spotify.com/authorize';

    const scopes = 'user-read-private user-read-email user-library-read user-top-read';

    const params = new URLSearchParams({
        response_type: 'token',
        client_id,
        redirect_uri,
        scope: scopes,  
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

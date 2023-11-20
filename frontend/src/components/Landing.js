import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faEnvelope, faHeart, faGear, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/landing.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('html').classList.toggle('openNav');
      setIsOpen(!isOpen);
    });

    const accessToken = localStorage.getItem('spotifyAccessToken', 'http://127.0.0.1:5500');
    if (accessToken) {
      fetchSpotifyProfile(accessToken);
    } else {
      console.log('Access Token not found in local storage.');
    }

    function fetchSpotifyProfile(accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      })
        .then(response => response.json())
        .then(profile => {
          updateProfileUI(profile);
        })
        .catch(error => {
          console.error('Error fetching Spotify profile:', error);
        });
    }

    function updateProfileUI(profile) {
      document.getElementById('profile-image').src = profile.images[0].url;
      document.getElementById('display-name').innerText = profile.display_name;
      document.getElementById('user-id').innerText = 'User ID: ' + profile.id;
      document.getElementById('email').innerText = 'Email: ' + profile.email;
    }
  }, [isOpen]);

  return (
    <div>
      <div className={`primary-nav ${isOpen ? 'openNav' : ''}`}>
        <button className="hamburger nav-toggle">
          <span className="screen-reader-text">Menu</span>
        </button>

        <nav role="navigation" className="menu">
          <a href="#" className="logotype">Cho<span>rds</span></a>

          <div className="overflow-container">
            <ul className="menu-dropdown">
              <li><a href="#">Profile</a><span className="icon"><FontAwesomeIcon icon={faDashboard} /></span></li>
              <li><a href="#">Messages</a><span className="icon"><FontAwesomeIcon icon={faEnvelope} /></span></li>
              <li><a href="#">Matches</a><span className="icon"><FontAwesomeIcon icon={faHeart} /></span></li>
              <li className="menu-hasdropdown">
                <a href="#">Settings</a><span className="icon"><FontAwesomeIcon icon={faGear} /></span>
                <label title="toggle menu" htmlFor="settings">
                  <span className="downarrow"><FontAwesomeIcon icon={faCaretDown} /></span>
                </label>
                <input type="checkbox" className="sub-menu-checkbox" id="settings" />
                <ul className="sub-menu-dropdown">
                  <li><a href="">Profile</a></li>
                  <li><a href="">Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="new-wrapper">
        <div id="main">
          <div id="main-contents">
            <h1>Welcome to Chords</h1>
            <div id="profile-info">
              <img id="profile-image" src="" alt="Profile Image" />
              <h2 id="display-name"></h2>
              <p id="user-id"></p>
              <p id="email"></p>
              {/* Add more elements as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

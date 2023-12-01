import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';

// Import your circular image
import circularImage from './test.png';

// Import artist images
import artistImage1 from './test.png';
import artistImage2 from './test.png';
import artistImage3 from './test.png';
import artistImage4 from './test.png';
import artistImage5 from './test.png';

const User = () => {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true); 

  const location = useLocation();
  const { username } = location.state || {};

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
            'http://localhost:5000/validateSpotifyToken',
            { username: username },
          );
          console.log(response.data.profile)

        setProfile(response.data.profile);
        const [topArtistsData, topTracksData] = await Promise.all([
            fetchTopArtists(response.data.accessToken),
            fetchTopTracks(response.data.accessToken),
        ]);
        setTopArtists(topArtistsData.items);
        setTopTracks(topTracksData.items);
        setLoading(false);
        
      } catch (error) {
  console.error('Error:', error.response.data); // Log the error response from the server
}
    };

    fetchProfileData();
  }, []);

  async function fetchTopArtists(token) {
    const result = await fetch('https://api.spotify.com/v1/me/top/artists', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  async function fetchTopTracks(token) {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    return await result.json();
  }

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <div className="cream-colored-page">
      <div className="top-section">
        <div className="content-wrapper">
          <img className="circular-image" src={circularImage} alt="Circular" />
          <div className="text-content">
            <h1>
              Hey! check out your stats & <br /> insights below.
            </h1>
          </div>
        </div>
      </div>

      <div className="top-artists-section">
        <div className="content-wrapper">
          <div className="text-content" style={{ textAlign: 'left' }}>
            <div className="artist1-info">
              <div className="artist-details">
                <h2>
                  <span style={{ color: 'rgb(253, 212, 206)' }}>Grooving to </span>
                  <br />
                  <span style={{ color: 'rgb(231, 42, 22)' }}>JUICE WRLD</span>
                </h2>
                <p>
                  <span style={{ color: 'rgb(236, 240, 241)' }}>
                    When it comes to your favorite artist at the<br />
                    moment, no one does it quite like JUICE WRLD!
                  </span>
                </p>
              </div>
              <img
                className="artist-image"
                src={artistImage1}
                alt="JUICE WRLD"
                style={{
                  marginLeft: '50px',
                  marginTop: '50px',
                  width: '400px',
                  height: '400px',
                  borderRadius: '30px',
                }}
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        <br/>
        <br/>
        <div className="artist-matrix">
          <div className="artist-item">
            <img className="artist-image" src={artistImage2} alt="Artist 1" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#2</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>Post Malone</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={artistImage3} alt="Artist 2" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#3</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>Drake</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={artistImage4} alt="Artist 3" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#4</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>Ed Sheeran</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={artistImage5} alt="Artist 4" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#5</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>Ariana Grande</span>
            </div>
          </div>
        </div>
      </div>
      <div className="top-tracks-section">
        <h2>Tracks</h2>
        <br/>
        <p>
        Here are your all-time top 10 tracks according to Spotify.
        </p>
        <br/>
        <br/>
        <br/>
        <ul>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#1</span> Track 1
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#2</span> Track 2
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#3</span> Track 3
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#4</span> Track 4
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#5</span> Track 5
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#6</span> Track 6
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#7</span> Track 7
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#8</span> Track 8
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#9</span> Track 9
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '20px'}}>#10</span> Track 10
          </li>
        </ul>
      </div>
    </div>
  );
};

export default User;
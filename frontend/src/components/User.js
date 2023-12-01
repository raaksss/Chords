import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/user.css'



const User = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(username);
        const response = await axios.post(
          'http://localhost:5000/validateSpotifyToken',
          { username },
        );
        const { profile, accessToken } = response.data;
        localStorage.setItem('name', profile.display_name);
  
        const [topArtistsData, topTracksData] = await Promise.all([
          fetchTopArtists(accessToken),
          fetchTopTracks(accessToken),
        ]);
        setProfile(profile);
        console.log('API Response:', topArtistsData);
        setTopArtists(topArtistsData.items);
        setTopTracks(topTracksData.items);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    };
  
    fetchData();
  }, [username]);
  
  useEffect(() => {
    console.log('Top Artists:', topArtists);
  }, [topArtists]);
  useEffect(() => {
    console.log('Top Songs:', topTracks);
  }, [topTracks]);


      async function fetchTopArtists(accesstoken) {
        const result = await fetch('https://api.spotify.com/v1/me/top/artists', {
          method: 'GET',
          headers: { Authorization: `Bearer ${accesstoken}` },
        });
        return await result.json();
      }

  async function fetchTopTracks(accesstoken) {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accesstoken}` },
    });

    return await result.json();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='whole'>
    <div className="cream-colored-page">
      <div className="top-section">
        <div className="content-wrapper">
        <img className="circular-image" src={profile.images[0].url} alt="Profile Avatar" />
          <div className="text-content">
            <h1>
              Hey <span >{username}</span>! Check out your stats & <br /> insights below.
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
                  <span style={{ color: 'rgb(231, 42, 22)' }}>{topArtists[0]?.name}</span>
                </h2>
                <p>
                  <span style={{ color: 'rgb(236, 240, 241)' }}>
                    When it comes to your favorite artist at the<br />
                    moment, no one does it quite like <span >{topArtists[0]?.name}</span>
                  </span>
                </p>
              </div>
              {topArtists[0]?.images.length > 0 && (
              <img
                className="artist-image"
                src={topArtists[0]?.images[0].url}
                alt="JUICE WRLD"
                style={{
                  marginLeft: '50px',
                  marginTop: '50px',
                  width: '400px',
                  height: '400px',
                  borderRadius: '30px',
                }}
              />
               )}
            </div>
          </div>
        </div>
        <br />
        <br />
        <br/>
        <br/>
        <div className="artist-matrix">
          <div className="artist-item">
            <img className="artist-image" src={topArtists[1]?.images[1].url} alt="Artist 1" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#2</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>{topArtists[1]?.name}</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={topArtists[2]?.images[2].url} alt="Artist 2" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#3</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>{topArtists[2]?.name}</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={topArtists[3]?.images[2].url} alt="Artist 3" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#4</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>{topArtists[3]?.name}</span>
            </div>
          </div>
          <div className="artist-item">
            <img className="artist-image" src={topArtists[4]?.images[2].url} alt="Artist 4" />
            <div className="artist-details">
              <span style={{ color: 'rgb(231, 42, 22)' }}>#5</span>
              <br />
              <span style={{ color: 'rgb(253, 212, 206)' }}>{topArtists[4]?.name}</span>
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
          <span style={{color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#1
          </span>
          {topTracks[0]?.name} 
          <span style={{fontSize:'20px', fontStyle: 'italic'}}> {  topTracks[0]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#2</span>{topTracks[1]?.name} <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[1]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#3</span> {topTracks[2]?.name}  <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[2]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#4</span> {topTracks[3]?.name}  <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[3]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#5</span>{topTracks[4]?.name}   <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[4]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#6</span> {topTracks[5]?.name}   <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[5]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#7</span> {topTracks[6]?.name}    <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[6]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#8</span> {topTracks[7]?.name}<span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[7]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '31px'}}>#9</span> {topTracks[8]?.name} <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[8]?.artists[0].name}</span>
          </li>
          <li>
          <span style={{ color: '#f5f5dc', fontWeight: 'bold', fontSize:'45px', marginRight: '20px'}}>#10</span> {topTracks[9]?.name} <span style={{fontSize:'20px', fontStyle: 'italic'}}> {topTracks[9]?.artists[0].name}</span>
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default User;
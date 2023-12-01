import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(username)
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
        setTopArtists(topArtistsData.items);
        setTopTracks(topTracksData.items);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    };
    fetchData();
  }, [username]);

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
    <div>
      <h1>Display your Spotify profile data</h1>
      <section id="profile">
        <h2>Logged in as <span id="displayName">{profile.display_name}</span></h2>
        {profile.images[1] && (
          <span id="avatar">
            <img src={profile.images[0].url} alt="Profile Avatar" />
          </span>
        )}
      </section>
      <section id="top-artists">
        <h2>Top Artists of All Time</h2>
        <ul>
          {topArtists.map((artist, i) => (
            <li key={i}>
              {artist.name}
            </li>
          ))}
        </ul>
      </section>

      <section id="top-tracks">
        <h2>Top Tracks of All Time</h2>
        <ul>
          {topTracks.map((track, i) => (
            <li key={i}>
              {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default User;
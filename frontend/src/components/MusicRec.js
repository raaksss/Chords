import React, { useState, useEffect } from 'react';
// import '../styles/insights.css';
// import { useLocation } from 'react-router-dom';


const ColorSection = ({ gradient, children, emoji, align }) => (
  <div style={{ background: gradient, padding: '200px', textAlign: align, position: 'relative', color: 'white', marginTop: '0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
    {children}
    <div className="emoji-container" data-emoji={emoji} />
  </div>
);

function MusicRec() {
  const [flask_musicrecs, setMusicrecs] = useState([]);

  useEffect(() => {
    fetch('/rec')
      .then(res => res.json())
      .then(data => {
        setMusicrecs(Array.isArray(data) ? data : []);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const emojiContainers = document.querySelectorAll('.emoji-container');

    const createEmoji = (container) => {
      const emoji = document.createElement('span');
      emoji.innerHTML = container.getAttribute('data-emoji');
      emoji.style.position = 'absolute';
      emoji.style.left = '0';
      emoji.style.fontSize = '7em';
      emoji.style.opacity = '0.25';
      emoji.style.animation = 'emoji-flow 20s linear infinite';
      container.appendChild(emoji);

      // Remove emoji after animation completes
      emoji.addEventListener('animationiteration', () => {
        emoji.remove();
      });
    };

    const emojiIntervals = emojiContainers.forEach((container) =>
      setInterval(() => createEmoji(container), 2000)
    );

    return () => {
      emojiIntervals.forEach(clearInterval);
    };
  }, []);

  return (
    <div style={{ overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ColorSection gradient="linear-gradient(to right, #fc83c8, #ff7a8a)" emoji="💕" align="left">
        <div style={{ fontSize: '1.5em' }}>
          <p>Here are your Recommended Songs:</p>
          {flask_musicrecs.length > 0 ? (
            flask_musicrecs.map((song, index) => (
              <p key={index}>{song}</p>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>
      </ColorSection>
    </div>
  );
}

export default MusicRec;


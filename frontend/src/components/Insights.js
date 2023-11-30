import React, { useEffect } from 'react';
import '../styles/insights.css';

const ColorSection = ({ gradient, children, emoji, align }) => (
  <div style={{ background: gradient, padding: '200px', textAlign: align, position: 'relative', color: 'white', marginTop: '0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
    {children}
    <div className="emoji-container" data-emoji={emoji} />
  </div>
);

function App() {
  useEffect(() => {
    const emojiContainers = document.querySelectorAll('.emoji-container');

    // Function to create and animate emojis
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

    // Interval to create emojis for each section
    emojiContainers.forEach((container) => {
      const emojiInterval = setInterval(() => createEmoji(container), 2000);
      return () => clearInterval(emojiInterval);
    });
  }, []);

  return (
    <div style={{ overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Section 1 - Happy Vibes Gradient */}
      <ColorSection gradient="linear-gradient(to right, #FFD700, #FFA500)" emoji="😃" align="left">
        <div>
          <strong style={{ fontSize: '4em', marginTop: '0', marginLeft: '0', paddingLeft: '0' }}>45% Happy</strong>
        </div>

        <div style={{ fontSize: '1.5em' }}>
          <p> Tracks with a high happiness score sound more positive (e.g. happy, cheerful),<br></br>
          while tracks with a low score sound more negative (e.g. sad, angry). </p>
        </div>
      </ColorSection>
      {/* Section 2 */}
      <ColorSection gradient="linear-gradient(to right, #000033, #330033, #9900cc, #660066)" emoji=" 💃" align="right">
        <div>
          <strong style={{ fontSize: '4em', marginTop: '0', marginRight: '0', paddingRight: '0' }}>45% Danceable</strong>
        </div>
        <br></br>
        <div style={{ fontSize: '1.5em' }}>
          <p>The danceability of tracks is judged by musical elements such as tempo,<br></br>
          rhythm stability, and beat strength to give a score on how well you could groove to it.</p>
        </div>
      </ColorSection>

      {/* Section 3 */}
      <ColorSection gradient="linear-gradient(to right, #FF4500, #FFD700)" emoji="⚡" align="left">
        <div>
          <strong style={{ fontSize: '4em', marginTop: '0', marginLeft: '0', paddingLeft: '0' }}>45% Energy</strong>
        </div>
        <br></br>
        <div style={{ fontSize: '1.5em' }}>
        <p>Energetic tracks feel fast, loud and noisy. For example, heavy metal has <br></br>
        high energy while lo-fi hip pop might not.</p>
        </div>
      </ColorSection>

      {/* Section 4 */}
      <ColorSection gradient="linear-gradient(to right, #8B4513, #CD853F)" emoji="🎸" align="right">
        <div>
          <strong style={{ fontSize: '4em', marginTop: '0', marginRight: '0', paddingRight: '0' }}>45% Acoustic</strong>
        </div>
        <br></br>
        <div style={{ fontSize: '1.5em' }}>
        <p>Tracks with a higher acousticness score have more acoustic<br></br>
        elements compared to electronic.</p>
        </div>
      </ColorSection>
    </div>
  );
}
export default Insights;


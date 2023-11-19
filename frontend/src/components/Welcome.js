import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/welcome.css';

function Welcome() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/login');
  };
  return (
    <div className="wrapper" id="animation" onClick={handleClick}>
      <div className="border-circle" id="one"></div>
      <div className="border-circle" id="two"></div>
      <div className="background-circle" id="animation2">
        <div className="triangle-light"></div>
        <div className="body"></div>
        <span className="shirt-text">C</span>
        <span className="shirt-text">H</span>
        <span className="shirt-text">O</span>
        <span className="shirt-text">R</span>
        <span className="shirt-text">DS</span>
      </div>
      <div className="head">
        <div className="ear" id="left"></div>
        <div className="ear" id="right"></div>
        <div className="hair-main">
          <div className="sideburn" id="left"></div>
          <div className="sideburn" id="right"></div>
          <div className="hair-top"></div>
        </div>
        <div className="face">
          <div className="hair-bottom"></div>
          <div className="nose"></div>
          <div className="eye-shadow" id="left">
            <div className="eyebrow"></div>
            <div className="eye"></div>
          </div>
          <div className="eye-shadow" id="right">
            <div className="eyebrow"></div>
            <div className="eye"></div>
          </div>
          <div className="mouth"></div>
          <div className="shadow-wrapper">
            <div className="shadow"></div>
          </div>
        </div>
      </div>
      <span className="music-note" id="one">&#9835;</span>
      <span className="music-note" id="two">&#9834;</span>
    </div>
  );
}

export default Welcome;
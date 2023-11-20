import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signup.css';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const userData = {
      username,
      password,
    };

    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.includes('Username already in use')) {
          alert('Username already in use. Please choose a different username.');
        } else if (data.includes('User registered successfully')) {
          alert('User registered successfully!');
          navigate('/login');
        } else {
          alert('Registration failed. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div id="content">
      <div id="login-container">
        <div className="login">
          <form onSubmit={handleSubmit}>
            <h3>Enter Username <span className="required">*</span></h3>
            <input
              type="text"
              placeholder="Username"
              className="input__username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h3>Enter password <span className="required">*</span></h3>
            <input
              type="password"
              placeholder="Password"
              className="input__password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <h3>Re-enter Password <span className="required">*</span></h3>
            <input
              type="password"
              placeholder="Confirm Password"
              className="input__password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" className="big-btn">Sign Up</button>
          </form>
          <Link to="/login" className="signup-link">Already Have An Account? Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

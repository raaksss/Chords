import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    const userData = {
      username,
      password,
    };

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.includes('User does not exist.')) {
          alert('User does not exist, create a new account for free!');
          navigate('/authsp');
        } else if (data.includes('Incorrect password')) {
          alert('Password entered is incorrect.');
          return;
        } else {
          // Save username to local storage
          localStorage.setItem('username', username);

          navigate('/landing');
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
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="big-btn">
              Log in
            </button>
          </form>
          <Link to="/authsp" className="signup-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
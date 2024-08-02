import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthSpot from './components/AuthSpot';
import Landing from './components/Landing';
import SupInsight from './components/SupInsight';
import SupMessages from './components/SupMessages';
import SupMatches from './components/SupMatches';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/authsp" element={<AuthSpot/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/insights" element={<SupInsight />} />
        <Route path="/messages" element={<SupMessages />} />
        <Route path="/matches" element={<SupMatches />} />
      </Routes>
    </Router>
  );
}
export default App;

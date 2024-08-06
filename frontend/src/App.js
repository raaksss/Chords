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
import SupMusicRec from './components/SupMusicRec';

function App() {

  // const client_id = process.env.REACT_APP_CLIENT_ID;
  // console.log(client_id);

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
        <Route path="/musicrec" element={<SupMusicRec />} />
      </Routes>
    </Router>
  );
}
export default App;

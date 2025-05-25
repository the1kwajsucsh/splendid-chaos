import React from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router';
import Home from './home/Home';
import Music from './Music/Music';
import SongPage from './Music/SongPage';

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/music/:songId"
        element={<SongPage onNavigateBack={() => navigate('/music')} />}
      />
      <Route path="/music" element={<Music />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;

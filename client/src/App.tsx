import React from 'react';
import './App.css';
import { ResponsiveContainer } from './component/ResponsiveContainer';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './home/Home';
import Music from './Music/Music';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/music" element={<Music />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

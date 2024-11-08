import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import RestoItems from './components/resto/RestoItems';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route untuk landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Route untuk halaman RestoItems */}
          <Route path="/resto-items" element={<RestoItems />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

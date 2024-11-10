import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import RestoItems from './components/resto/order/index.js';
import RestoCartItems from './components/resto/order/cart/CartList.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route untuk landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Route untuk halaman RestoItems */}
          <Route path="/resto/order/:id/:notabel" element={<RestoItems />} />

            {/* Route untuk halaman Cart Resto */}
            <Route path="/resto/cart" element={<RestoCartItems />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

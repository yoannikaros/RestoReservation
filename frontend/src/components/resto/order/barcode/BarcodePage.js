import React from 'react';
import { useLocation } from 'react-router-dom';
import Barcode from 'react-barcode';

function BarcodePage() {
  const location = useLocation();
  const { idOrder } = location.state || {}; // Ambil idOrder dari state

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Your Order Barcode</h2>
      {idOrder ? (
        <Barcode value={idOrder} />
      ) : (
        <p>Loading barcode...</p>
      )}
    </div>
  );
}

export default BarcodePage;

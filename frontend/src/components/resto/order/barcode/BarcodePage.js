import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Barcode from 'react-barcode';
import io from 'socket.io-client';

function BarcodePage() {
  const location = useLocation();
  const { idOrder } = location.state || {}; // Ambil idOrder dari state
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!idOrder) return; // Pastikan idOrder ada sebelum mencoba koneksi socket
    
    const newSocket = io('http://localhost:3000'); // Ganti dengan URL server Anda
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    // Listen for updates from server for this specific order ID
    newSocket.on('order-status-update', (data) => {
      console.log('Received order status update:', data);
      // Pastikan perbandingan idOrder dan data.id_order sesuai tipe
      if (String(data.id_order) === String(idOrder)) {
        console.log('Updating status to:', data.status); // Log untuk memeriksa status yang diterima
        setStatus(data.status);
      }
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [idOrder]); // Perubahan pada idOrder akan trigger efek ini lagi

  // Log untuk debugging
  console.log('Current status:', status);

  if (!idOrder) {
    return <div>Loading...</div>; // Tampilkan loading jika idOrder belum tersedia
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Your Order Barcode</h2>
      <Barcode value={idOrder} />
      <h2>Status Order: {status || 'Loading status...'}</h2> {/* Menampilkan status order */}
    </div>
  );
}

export default BarcodePage;

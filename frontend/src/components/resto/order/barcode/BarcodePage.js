import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import io from 'socket.io-client';
import { getOrderId } from '../orderDB'; // Import fungsi baru

function BarcodePage() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook untuk navigasi
  const { idOrder } = location.state || {}; // Ambil idOrder dari state
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState(null);

  const checkOrder = async () => {
    try {
      // Ambil id_order dari cart
      const idOrder = await getOrderId();

      // Periksa apakah idOrder valid
      if (!idOrder) {
        console.error('ID Order tidak ditemukan.');
        return;
      }

      // Lakukan permintaan untuk mengecek status menggunakan idOrder
      const response = await fetch(`http://localhost:3000/api/order/status/${idOrder}`);
      const data = await response.json();

      if (data.status === 'pending') {
        navigate('/resto/order/barcode', { state: { idOrder: idOrder } });
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Gagal mengecek status.');
    }
  };


  useEffect(() => {
    if (!idOrder) return; // Pastikan idOrder ada sebelum mencoba koneksi socket

    const newSocket = io('http://localhost:3000'); // Ganti dengan URL server Anda
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    // Listen for updates from server untuk id_order tertentu
    newSocket.on('order-status-update', (data) => {
      console.log('Received order status update:', data);
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

  // Cek jika status sudah "paid", kemudian alihkan ke halaman lain
  useEffect(() => {
    if (status === 'paid') {
      navigate(`/resto/order/waiting`, { state: { idOrder: idOrder } });
    } else if (status === 'done') {
      navigate(`/`);
    }
  }, [status, navigate]);

  // Menghindari kembali ke halaman sebelumnya
  useEffect(() => {
    // Ganti riwayat sehingga tidak ada entri sebelumnya
    window.history.replaceState(null, '', window.location.href);

    const handlePopState = () => {
      // Ketika pengguna mencoba menggunakan tombol "back", kita tetap mengganti riwayat
      window.history.replaceState(null, '', window.location.href);
    };

    // Menambahkan event listener untuk popstate
    window.addEventListener('popstate', handlePopState);

    return () => {
      // Hapus event listener ketika komponen di-unmount
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Pastikan effect hanya dijalankan sekali

  const checkStatusManually = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/order/status/${idOrder}`);
      const data = await response.json();
      if (data.status === 'paid') {
        navigate('/resto/order/waiting'); // Alihkan ke halaman jika status paid
      } else if (status === 'done') {
        navigate(`/`);
      } else {
        alert('Order belum dibayar.');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Gagal mengecek status.');
    }
  };

  // Log untuk debugging
  console.log('Current status:', status);

  if (!idOrder) {
    checkOrder(); // Tampilkan loading jika idOrder belum tersedia
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Your Order Barcode</h2>
      <Barcode value={idOrder} />
      <h2>Status Order: {status || 'Loading status...'}</h2> {/* Menampilkan status order */}

      {/* Tombol untuk mengecek status secara manual */}
      <button onClick={checkStatusManually}>Cek Status Pembayaran</button>
    </div>
  );
}

export default BarcodePage;

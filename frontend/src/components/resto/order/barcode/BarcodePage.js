import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import io from 'socket.io-client';
import { getOrderId } from '../orderDB';
import config from '../../config';

function BarcodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { idOrder } = location.state || {};
  const [status, setStatus] = useState('');
  const [socket, setSocket] = useState(null);

  const checkOrder = async () => {
    try {
      const orderId = await getOrderId();
      if (!orderId) {
        console.error('ID Order tidak ditemukan.');
        return;
      }
      const response = await fetch(`${config.baseURL}/api/order/status/${orderId}`);
      const data = await response.json();

      if (data.status === 'pending') {
        navigate('/resto/order/barcode', { state: { idOrder: orderId } });
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Gagal mengecek status.');
    }
  };

  useEffect(() => {
    if (!idOrder) return;

    const newSocket = io(config.baseURL);
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Socket connected'));
    newSocket.on('order-status-update', (data) => {
      if (String(data.id_order) === String(idOrder)) {
        setStatus(data.status);
      }
    });

    return () => newSocket.disconnect();
  }, [idOrder]);

  useEffect(() => {
    if (['paid', 'done'].includes(status)) {
      status === 'paid'
        ? navigate(`/resto/order/waiting`, { state: { idOrder } })
        : handleBackToInitial();
    }
  }, [status, navigate]);

  useEffect(() => {
    window.history.replaceState(null, '', window.location.href);
    const handlePopState = () => window.history.replaceState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleBackToInitial = () => {
    const initialURL = sessionStorage.getItem('initialURL') || '/';
    navigate(initialURL);
  };

  const checkStatusManually = async () => {
    try {
      const response = await fetch(`${config.baseURL}/api/order/status/${idOrder}`);
      const data = await response.json();
      if (['paid', 'done'].includes(data.status)) {
        data.status === 'paid' ? navigate('/resto/order/waiting') : handleBackToInitial();
      } else {
        alert('Order belum dibayar.');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Gagal mengecek status.');
    }
  };

  if (!idOrder) {
    checkOrder();
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Your Order Barcode</h2>
      <Barcode value={idOrder} />
      <h2>Status Order: {status || 'Loading status...'}</h2>
      <button className="check-button" onClick={checkStatusManually}>Cek Status Pembayaran</button>
    </div>
  );
}

export default BarcodePage;

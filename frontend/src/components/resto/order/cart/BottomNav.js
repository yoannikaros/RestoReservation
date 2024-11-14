import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { submitCartToApi } from './cartApi'; // Import submitCartToApi
import { submitOrderApi } from './orderApi'; // Import submitOrderApi
import { getProfileIdFromCart } from './cartDB'; // Import fungsi baru
import { useNavigate } from 'react-router-dom';
import { saveOrderId } from '../orderDB'; // Import fungsi baru
import config from '../../config';


function BottomNav({ totalPrice, orderType, notabel }) {
  const [loading, setLoading] = useState(false); // State untuk melacak status loading
  const navigate = useNavigate();


  // Fungsi untuk mengambil serveType dan mengalihkan sesuai nilainya
  const fetchServeTypeAndRedirect = async (profileId, Idorder) => {
    try {
      const response = await fetch(`${config.baseURL}/api/settings/profile/${profileId}`);
      const data = await response.json();
      const serveType = data[0]?.serveType;

      // Cek nilai serveType dan alihkan sesuai nilainya
      if (serveType === 1) {
        // Bayar dulu baru makanan datang
        navigate('/resto/order/barcode', { state: { idOrder: Idorder } });
      } else if (serveType === 2) {
        // Menunggu Makanan datang lalu bayar, waiting room terlebih dahulu
        navigate(`/resto/order/waiting`, { state: { idOrder: Idorder } });
      }  else {
        console.log('Nilai serveType tidak valid:', serveType);
      }
    } catch (error) {
      console.error('Gagal mengambil serveType:', error);
    }
  };

  const handleSubmit = async () => {
    const profileId = await getProfileIdFromCart();
    setLoading(true); // Set loading menjadi true saat submit dimulai
    try {
      // Panggil submitCartToApi dan simpan nilai newTransactionNumber yang dikembalikan
      const noTrans = await submitCartToApi(notabel);

      // Kirimkan noTrans sebagai id_cart_resto ke submitOrderApi dan simpan id_order yang dikembalikan
      const Idorder = await submitOrderApi(notabel, totalPrice, orderType, noTrans);
      
      // Setelah id_order berhasil didapatkan, simpan di IndexedDB
      await saveOrderId(Idorder);

      await fetchServeTypeAndRedirect(profileId, Idorder);

      //alert('Order successfully submitted');
    } catch (error) {
      console.error('Failed to submit cart:', error);
      alert('Failed to submit cart');
    } finally {
      setLoading(false); // Set loading menjadi false setelah proses selesai
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '95%',
      backgroundColor: '#fff',
      borderTop: '1px solid #ddd',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }} variant="h6">
        Rp {totalPrice.toLocaleString('id-ID')}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit} 
        disabled={loading} // Disable tombol saat loading
        startIcon={loading ? <CircularProgress size={24} /> : null} // Tampilkan CircularProgress saat loading
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
}

export default BottomNav;

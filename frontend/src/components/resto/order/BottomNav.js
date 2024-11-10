import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { getTotalPrice } from './cart/cartDB'; // Import fungsi getTotalPrice

function BottomNav() {
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalPrice = async () => {
      const total = await getTotalPrice();
      setTotalPrice(total);
    };
    
    fetchTotalPrice();
  }, []);  // Dependency array kosong untuk menjalankan sekali saat komponen dirender

  // Fungsi untuk navigasi ke halaman /resto/cart
  const handleCartButtonClick = () => {
    navigate('/resto/cart');
  };

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
    }}>
      <IconButton>
        <ShoppingCartIcon sx={{ color: '#1976d2' }} />
      </IconButton>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Rp {totalPrice.toLocaleString('id-ID')}
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#1976d2',
          color: '#ffffff',
          borderRadius: '20px',
          '&:hover': { backgroundColor: '#1565c0' },
        }}
        onClick={handleCartButtonClick}
      >
        View Cart
      </Button>
    </Box>
  );
}

export default BottomNav;

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { submitCartToApi } from './cartApi'; // Import the function to handle submission

function BottomNav({ totalPrice }) {
  const handleSubmit = async () => {
    try {
      await submitCartToApi();
      alert('Cart successfully submitted');
    } catch (error) {
      console.error('Failed to submit cart:', error);
      alert('Failed to submit cart');
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
      <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }} variant="h6"> Rp {totalPrice.toLocaleString('id-ID')}</Typography>
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
    </Box>
  );
}

export default BottomNav;

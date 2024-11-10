import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function BottomNav({ totalPrice }) {
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
      <Typography variant="h6">Total: Rp {totalPrice.toLocaleString('id-ID')}</Typography>
      <Button variant="contained" color="primary">Submit</Button>
    </Box>
  );
}

export default BottomNav;

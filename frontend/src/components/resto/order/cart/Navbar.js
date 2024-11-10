// Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi kembali

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleBackClick = () => {
    navigate(-1); // Navigasi ke halaman sebelumnya
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1976d2', 
        height: '56px', 
        justifyContent: 'center' 
      }}
    >
      <Toolbar sx={{ minHeight: '56px', display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleBackClick} edge="start" color="inherit" aria-label="back" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontSize: isMobile ? '1rem' : '1.25rem', fontWeight: 500, flexGrow: 1, textAlign: 'center' }}>
          Confirm Order
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

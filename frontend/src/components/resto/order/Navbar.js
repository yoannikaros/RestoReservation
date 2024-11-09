// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, InputBase, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SearchIcon sx={{ marginRight: 1 }} />
          <InputBase
            placeholder="Search…"
            sx={{ color: 'inherit', flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<MenuIcon />}
          sx={{
            marginLeft: 2,
            backgroundColor: '#ffffff',
            color: '#1976d2',
            borderRadius: '20px',
            '&:hover': { backgroundColor: '#e3f2fd' },
          }}
        >
          Menu
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

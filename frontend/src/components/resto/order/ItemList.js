// src/components/ItemList.js
import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

function ItemList({ items, onOpenDetail, onCartClick }) {
  return (
    <Box padding={3}>
      <Box display="flex" flexDirection="column" gap={2}>
        {items.map((item) => (
          <Paper
            key={item.id_resto_item}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              cursor: 'pointer',
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              },
            }}
            onClick={() => onOpenDetail(item.id_resto_item)}
          >
            <img
              src={item.photo}
              alt={item.title}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                objectFit: 'cover',
                marginRight: '16px',
              }}
            />
            <Box display="flex" flexDirection="column" alignItems="flex-start" flex="1">
              <Typography variant="h6" fontWeight="600" sx={{ fontSize: '0.975rem' }}>
                {item.title}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: '0.975rem' }}>
                Rp{item.base_price}
              </Typography>

            </Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: '16px', // Sesuaikan border-radius untuk tampilan lebih kecil
                backgroundColor: '#1976d2',
                color: '#ffffff',
                fontSize: '0.75rem', // Sesuaikan ukuran font untuk tampilan lebih kecil
                padding: '2px 8px', // Kurangi padding agar lebih kecil
                minWidth: 'auto', // Hilangkan lebar minimum default tombol
                '&:hover': { backgroundColor: '#1565c0' },
              }}
              onClick={(e) => {
                e.stopPropagation(); // Menghentikan event propagation
                onCartClick(item.id_resto_item);
              }}
            >
              Tambah
            </Button>

          </Paper>
        ))}
        {/* Spacer untuk memberikan ruang kosong di akhir daftar */}
        <Box height="50px" />
      </Box>
    </Box>
  );
}

export default ItemList;

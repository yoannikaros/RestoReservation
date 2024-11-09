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
              transition: 'transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
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
              <Typography variant="h6" fontWeight="600">{item.title}</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Rp{item.base_price}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: '20px',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                padding: '4px 12px',
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
      </Box>
    </Box>
  );
}

export default ItemList;

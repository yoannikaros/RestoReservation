// src/components/CartModal.js
import React from 'react';
import { Modal, Box, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CartModal({ open, onClose, variants }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: '40%',
        bgcolor: 'background.paper',
        borderRadius: '16px 16px 0 0',
        boxShadow: 24,
        p: 3,
        overflowY: 'auto',
      }}>
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="600" gutterBottom>Varian untuk Item</Typography>
        <List>
          {variants.map((variant) => (
            <ListItem key={variant.variant_id || 'base_price'}>
              <ListItemText
                primary={variant.title || "Original"} // Ganti dengan "Original" jika title tidak ada
                secondary={`Harga: Rp${variant.extra_price}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}

export default CartModal;

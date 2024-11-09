// src/components/DetailModal.js
import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function DetailModal({ open, onClose, selectedItem }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: '40%',
          bgcolor: 'background.paper',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', // Lighter shadow
          borderTop: '1px solid transparent', // Optional to blend the top
          p: 3,
          overflowY: 'auto',
        }}
      >

        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        {selectedItem && (
          <>
            <Typography variant="h6" fontWeight="600" gutterBottom>{selectedItem.title}</Typography>
            <img src={selectedItem.photo} alt={selectedItem.title} style={{
              width: '100%', height: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px'
            }} />
            <Typography variant="h6" color="primary" gutterBottom>Harga: Rp{selectedItem.base_price}</Typography>
            <Typography variant="body2" color="textSecondary">Stok: {selectedItem.stock}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{selectedItem.description}</Typography>

          </>
        )}
      </Box>
    </Modal>
  );
}

export default DetailModal;

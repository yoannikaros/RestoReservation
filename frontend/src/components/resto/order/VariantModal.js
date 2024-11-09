import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, ButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CartModal({ open, onClose, variants, photo }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Function to reset variant on modal close
  const handleModalClose = () => {
    setSelectedVariant({ title: "Pilih varian", extra_price: 0 });
    setQuantity(1); // Reset quantity if needed
    onClose();
  };

  // Function to select a variant
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  // Function to increment or decrement quantity
  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: '34%',
        bgcolor: 'background.paper',
        borderRadius: '16px 16px 0 0',
        boxShadow: 24,
        p: 3,
        overflowY: 'auto',
      }}>
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={handleModalClose}
        >
          <CloseIcon />
        </IconButton>

        {photo && (
          <Box mb={2} display="flex" justifyContent="center">
            <img src={photo} alt="Item" style={{
              width: '100%', height: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '5px'
            }} />
          </Box>
        )}

        <Typography variant="body1" color="text.secondary" gutterBottom>Silakan pilih varian</Typography>

        <ButtonGroup variant="outlined" fullWidth>
          {variants.map((variant) => (
            <Button
              key={variant.variant_id || 'base_price'}
              variant={selectedVariant === variant ? 'contained' : 'outlined'}
              onClick={() => handleVariantSelect(variant)}
            >
              {variant.title || "Original"}
            </Button>
          ))}
        </ButtonGroup>

        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'white',
          p: 2,
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box>
              <Typography variant="h6" color="black">
                Rp{selectedVariant ? selectedVariant.extra_price : '0'}
              </Typography>
              <Typography variant="body1" color="black">
                {selectedVariant ? selectedVariant.title : 'Pilih varian'}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Button sx={{ color: 'black' }} onClick={() => handleQuantityChange(-1)}>-</Button>
              <Typography sx={{ mx: 2, color: 'black' }}>{quantity}</Typography>
              <Button sx={{ color: 'black' }} onClick={() => handleQuantityChange(1)}>+</Button>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 1,
              color: 'white',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
              maxWidth: '100%',
            }}
            onClick={() => {
              console.log(`Menambahkan ${quantity} item ke keranjang dengan varian ${selectedVariant?.title}`);
              handleModalClose();
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CartModal;

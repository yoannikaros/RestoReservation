
import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, ButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CartModal({ open, onClose, variants , photo  }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fungsi untuk memilih varian
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  // Fungsi untuk menambah atau mengurangi jumlah
  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        {/* Tombol Close */}
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {/* Tampilan Foto Item */}
        {photo && (
          <Box mb={2} display="flex" justifyContent="center">
            <img src={photo} alt="Item" style={{ width: '100%', maxWidth: '200px', borderRadius: '8px' }} />
          </Box>
        )}

        {/* Judul Varian */}
        <Typography variant="body1" color="text.secondary" gutterBottom>Silakan pilih varian</Typography>

        {/* Pilihan Varian */}
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

        {/* Bagian Bawah Hijau Mengambang */}
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
          {/* Baris Harga dan Counter */}
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            {/* Harga di sebelah kiri */}
            <Box>
              <Typography variant="h6" color="black">
                Rp{selectedVariant ? selectedVariant.extra_price : '0'}
              </Typography>

              {/* Nama Varian di bawah harga, rata kiri */}
              <Typography variant="body1" color="black">
                {selectedVariant ? selectedVariant.title : 'Pilih varian'}
              </Typography>
            </Box>

            {/* Counter di sebelah kanan harga */}
            <Box display="flex" alignItems="center">
              <Button sx={{ color: 'black' }} onClick={() => handleQuantityChange(-1)}>-</Button>
              <Typography sx={{ mx: 2, color: 'black' }}>{quantity}</Typography>
              <Button sx={{ color: 'black' }} onClick={() => handleQuantityChange(1)}>+</Button>
            </Box>
          </Box>

          {/* Tombol Add to Cart */}
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
              // Logika untuk menambahkan item ke keranjang
              console.log(`Menambahkan ${quantity} item ke keranjang dengan varian ${selectedVariant?.title}`);
              onClose();
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

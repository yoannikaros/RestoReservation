import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, Button, ButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addItemToCart, getCartItems, updateItemQuantity } from './cart/cartDB';

function CartModal({ open, onClose, variants, photo, base_price, profile_id, id_resto_item, title }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    // Memuat data keranjang saat komponen di-mount
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartItems(items);
    };
    fetchCartItems();
  }, []);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity ke 1 setiap kali varian berubah
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  const handleAddToCart = async () => {
    if (selectedVariant) {
      // Cek jika item sudah ada di keranjang berdasarkan `profile_id` dan `id_resto_item`
      const existingItem = cartItems.find(
        (item) =>
          item.profile_id === profile_id &&
          item.id_resto_item === id_resto_item &&
          item.variant_id === (selectedVariant.variant_id ?? 0)
      );

      if (existingItem) {
        // Update quantity jika item sudah ada
        await updateItemQuantity(existingItem.id_cart_resto, existingItem.quantity + quantity);
      } else {
        // Tambahkan item baru jika belum ada
        await addItemToCart({
          profile_id,
          id_resto_item,
          variant_id: selectedVariant.variant_id ?? 0,
          quantity,
          status: 'pending',
          title,
          variant_title: selectedVariant.title, // Nama variant yang dipilih
          harga: totalPrice 
        });
      }
      onClose();
    }
  };

  const totalPrice = selectedVariant && selectedVariant.title !== "Original"
    ? (base_price + selectedVariant.extra_price) * quantity
    : base_price * quantity;

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
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {photo && (
          <Box mb={2} display="flex" justifyContent="center">
            <img src={photo} alt="Item" style={{
              width: '100%', height: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px'
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
          maxWidth: '96%',
          margin: '0 auto',
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box>
              <Typography variant="h6" color="black">
                Rp{totalPrice}
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
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default CartModal;

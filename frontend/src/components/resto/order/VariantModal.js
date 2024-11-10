import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, Button, ButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { addItemToCart, getCartItems, updateItemQuantity, getTotalPrice, getTotalQuantity } from './cart/cartDB';
import { useParams } from 'react-router-dom';

function CartModal({ open, onClose, variants, photo, base_price, profile_id, id_resto_item, title }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartItems(items);
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    fetchTotalPrice();
  }, []);

  useEffect(() => {
    const fetchTotalQuantity = async () => {
      const quantity = await getTotalQuantity();
      setTotalQuantity(quantity);
    };
    fetchTotalQuantity();
  }, [cartItems]); // Dependensi pada cartItems untuk meng-update saat item berubah


  const fetchTotalPrice = async () => {
    const total = await getTotalPrice();
    setTotalPrice(total);
  };

  const [totalQuantity, setTotalQuantity] = useState(0);


  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
  };

  const handleAddToCart = async () => {
    if (selectedVariant) {
      const existingItem = cartItems.find(
        (item) =>
          item.profile_id === profile_id &&
          item.id_resto_item === id_resto_item &&
          item.variant_id === (selectedVariant.variant_id ?? 0)
      );

      if (existingItem) {
        await updateItemQuantity(existingItem.id_cart_resto, existingItem.quantity + quantity);
      } else {
        await addItemToCart({
          profile_id,
          id_resto_item,
          variant_id: selectedVariant.variant_id ?? 0,
          quantity,
          status: 'pending',
          title,
          variant_title: selectedVariant.title,
          harga: selectedVariant && selectedVariant.title !== "Original"
            ? (base_price + selectedVariant.extra_price) * quantity
            : base_price * quantity,
          photo
        });
      }
      fetchTotalPrice();
      const newTotalQuantity = await getTotalQuantity();
      setTotalQuantity(newTotalQuantity); // Update total quantity setelah perubahan
      onClose();
    }
  };

  const { id, notabel } = useParams();

  const handleCartButtonClick = () => {
    // navigate('/resto/cart/:id/:notabel');
    navigate(`/resto/cart/${id}/${notabel}`);
  };

  return (
    <>
      {/* Modal for selecting variant and quantity */}
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
                  Rp{selectedVariant && selectedVariant.title !== "Original"
                    ? (base_price + selectedVariant.extra_price) * quantity
                    : base_price * quantity}
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

      {/* Bottom Navigation */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
      }}>
        <IconButton onClick={handleCartButtonClick}>
          <ShoppingCartIcon sx={{ color: '#1976d2' }} />
          {totalQuantity > 0 && (
            <span style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.75rem',
            }}>
              {totalQuantity}
            </span>
          )}
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Rp {totalPrice.toLocaleString('id-ID')}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: '#ffffff',
            borderRadius: '20px',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
          onClick={handleCartButtonClick}
        >
          View Cart
        </Button>
      </Box>
    </>
  );
}

export default CartModal;

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { getCartItems, updateItemQuantity, deleteItemFromCart } from './cartDB';

function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(59);
  const [orderType, setOrderType] = useState('Dine-in');
  const [totalPrice, setTotalPrice] = useState(0);

  const loadCartItems = async () => {
    const items = await getCartItems();
    setCartItems(items);
    calculateAndSetTotalPrice(items);
  };

  const handleQuantityChange = async (id, increment) => {
    const item = cartItems.find((item) => item.id_cart_resto === id);
    if (item) {
      const newQuantity = item.quantity + increment;

      if (newQuantity <= 0) {
        await deleteItemFromCart(id);
      } else {
        await updateItemQuantity(id, newQuantity);
      }
      loadCartItems();
    }
  };

  const calculateAndSetTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.harga * item.quantity, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <>
      <Navbar />

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd'
      }}>
        <Typography variant="h6">My Table: {tableNumber}</Typography>
        <Box>
          <Button
            variant={orderType === 'Dine-in' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setOrderType('Dine-in')}
            sx={{ marginRight: 1 }}
          >
            Dine-in
          </Button>
          <Button
            variant={orderType === 'Take-away' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setOrderType('Take-away')}
          >
            Take away
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2, mb: 4 }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Box key={item.id_cart_resto} sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              mb: 1,
              boxShadow: 2,
              borderRadius: 1,
              backgroundColor: '#fff',
            }}>
              {/* Foto produk */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mr: 2,
              }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  mb: 1,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}>
                  <img
                    src={item.photo}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>

              {/* Detail item dengan nama dan harga di satu baris */}
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{fontWeight: 'bold', fontSize: '0.975rem' }} variant="h6">{item.title}</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'regular', fontSize: '0.875rem' }}>
                    {`Rp ${item.harga.toLocaleString()}`}
                  </Typography>
                </Box>

                {/* Varian dan counter di satu baris */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    display: 'inline-block',
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.variant_title}
                    </Typography>
                  </Box>

                  <Box sx={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    px: 0.5,
                    py: 0.25,
                  }}>
                    <IconButton onClick={() => handleQuantityChange(item.id_cart_resto, -1)} color="inherit" size="small">
                      <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <Typography variant="body2" sx={{ mx: 0.5 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleQuantityChange(item.id_cart_resto, 1)} color="inherit" size="small">
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Keranjang Anda kosong.
          </Typography>
        )}
      </Box>

      <BottomNav totalPrice={totalPrice} />
    </>
  );
}

export default CartList;

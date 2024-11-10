import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
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

  const handleDeleteItem = async (id) => {
    await deleteItemFromCart(id);
    loadCartItems();
  };

  const calculateAndSetTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.harga * item.quantity, 0);
    setTotalPrice(total);
  };

  // Fungsi untuk menghitung total harga per item
  const calculateTotalPrice = (item) => {
    return item.harga * item.quantity;
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

      <Box sx={{ p: 2, mb: 8 }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <Paper key={item.id_cart_resto} sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              mb: 1,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: '#fff',
            }}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.variant_title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {`Total: Rp ${calculateTotalPrice(item).toLocaleString()}`}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleQuantityChange(item.id_cart_resto, -1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(item.id_cart_resto, 1)}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem(item.id_cart_resto)} color="danger">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
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

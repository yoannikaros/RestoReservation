import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { getCartItems, updateItemQuantity, deleteItemFromCart,updateItemNote } from './cartDB';
import { useParams } from 'react-router-dom';
import { getOrderId } from '../orderDB'; // Import fungsi baru
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function CartList() {
  const { id, notabel } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState('Dine-in');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAllItems, setShowAllItems] = useState(false);
  const [notes, setNotes] = useState({});
  const navigate = useNavigate();

  
  
  const checkOrder = async () => {
    try {
      // Ambil id_order dari cart
      const idOrder = await getOrderId();
      
      // Periksa apakah idOrder valid
      if (!idOrder) {
        console.error('ID Order tidak ditemukan.');
        return;
      }
  
      // Lakukan permintaan untuk mengecek status menggunakan idOrder
      const response = await fetch(`${config.baseURL}/api/order/status/${idOrder}`);
      const data = await response.json();
      
      if (data.status === 'pending') {
        navigate('/resto/order/barcode', { state: { idOrder: idOrder } });
      } else if (data.status === 'paid') {
        navigate(`/resto/order/waiting`, { state: { idOrder: idOrder } });
      } else if (data.status === 'ready') {
        navigate(`/resto/order/waiting`, { state: { idOrder: idOrder } });
      } 
    } catch (error) {
      console.error('Error fetching status:', error);
      alert('Gagal mengecek status.');
    }
  };

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
    checkOrder();
    if (!sessionStorage.getItem('initialURL')) {
      sessionStorage.setItem('initialURL', `/resto/order/${id}/${notabel}`);
    }
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
        <Typography variant="h6">My Table: {notabel}</Typography>
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
          <>
            {(showAllItems ? cartItems : cartItems.slice(0, 3)).map((item) => (
              <Box key={item.id_cart_resto} sx={{
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                mb: 1,
                boxShadow: 2,
                borderRadius: 1,
                backgroundColor: '#fff',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
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

                  <Box sx={{ flex: 1, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '0.975rem' }} variant="h6">{item.title}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'regular', fontSize: '0.875rem' }}>
                        {`Rp ${item.harga.toLocaleString()}`}
                      </Typography>
                    </Box>

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

                {/* Input untuk menambah catatan */}
                <TextField
                  label="Catatan"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  placeholder="Tambah catatan untuk item ini"
                  value={notes[item.id_cart_resto] || item.note || ''} // Isi dari notes atau note di IDB
                  onChange={(e) => setNotes({ ...notes, [item.id_cart_resto]: e.target.value })} // Update notes sementara
                  onBlur={async () => { // Simpan saat blur
                    await updateItemNote(item.id_cart_resto, notes[item.id_cart_resto]);
                    loadCartItems(); // Refresh data untuk memperlihatkan catatan terbaru
                  }}
                />
              </Box>
            ))}

            {/* Tombol "View More" */}
            {cartItems.length > 3 && (
              <Button
                onClick={() => setShowAllItems(!showAllItems)}
                sx={{ mt: 2 }}
              >
                {showAllItems ? 'View Less' : 'View More'}
              </Button>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Keranjang Anda kosong.
          </Typography>
        )}
      </Box>

      <BottomNav totalPrice={totalPrice} orderType={orderType} notabel={notabel} />
    </>
  );
}

export default CartList;

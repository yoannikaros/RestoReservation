import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Modal,
  List,
  ListItem,
  ListItemText,
  InputBase,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function RestoItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variants, setVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const totalPrice = 3000000; // contoh total harga yang ditampilkan

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/resto_items');
        setItems(response.data.results.resto_item);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/resto_items/${id}`);
      setSelectedItem(response.data.results.resto_item);
      setOpenDetailModal(true);
    } catch (error) {
      setError("Error fetching item details");
    }
  };

  const handleCartClick = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/variants/resto_item/${id}`);
      setVariants(response.data);
      setOpenCartModal(true);
    } catch (error) {
      setError("Error fetching variants");
    }
  };

  const handleCloseDetail = () => {
    setOpenDetailModal(false);
    setSelectedItem(null);
  };

  const handleCloseCart = () => {
    setOpenCartModal(false);
    setVariants([]);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <SearchIcon sx={{ marginRight: 1 }} />
            <InputBase
              placeholder="Search…"
              sx={{ color: 'inherit', flex: 1 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<MenuIcon />}
            sx={{
              marginLeft: 2,
              backgroundColor: '#ffffff',
              color: '#1976d2',
              borderRadius: '20px',
              '&:hover': { backgroundColor: '#e3f2fd' },
            }}
          >
            Menu
          </Button>
        </Toolbar>
      </AppBar>

      <Box padding={3}>
        <Box display="flex" flexDirection="column" gap={2}>
          {filteredItems.map((item) => (
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
              onClick={() => handleOpenDetail(item.id_resto_item)}
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
                  handleCartClick(item.id_resto_item);
                }}
              >
                Tambah
              </Button>
            </Paper>
          ))}
        </Box>

        {/* Detail Modal */}
        <Modal open={openDetailModal} onClose={handleCloseDetail}>
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: '40%',  // Sisakan ruang di bagian atas
            bgcolor: 'background.paper',
            borderRadius: '16px 16px 0 0',  // Rounded top corners
            boxShadow: 24,
            p: 3,
            overflowY: 'auto',
            animation: 'slideUp 0.9s ease-out', // Animasi muncul dari bawah
          }}>
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={handleCloseDetail}
            >
              <CloseIcon />
            </IconButton>
            {selectedItem && (
              <>
                <Typography variant="h6" fontWeight="600" gutterBottom>{selectedItem.title}</Typography>
                <img src={selectedItem.photo} alt={selectedItem.title} style={{
                  width: '100%', height: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px'
                }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>{selectedItem.description}</Typography>
                <Typography variant="h6" color="primary" gutterBottom>Harga: Rp{selectedItem.base_price}</Typography>
                <Typography variant="body2" color="textSecondary">Stok: {selectedItem.stock}</Typography>
              </>
            )}
          </Box>
        </Modal>

        {/* Cart Modal */}
        <Modal open={openCartModal} onClose={handleCloseCart}>
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: '40%',  // Sisakan ruang di bagian atas
            bgcolor: 'background.paper',
            borderRadius: '16px 16px 0 0',
            boxShadow: 24,
            p: 3,
            overflowY: 'auto',
            animation: 'slideUp 1.0s ease-out', // Animasi muncul dari bawah
          }}>
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={handleCloseCart}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="600" gutterBottom>Varian untuk Item</Typography>
            <List>
              {variants.map((variant) => (
                <ListItem key={variant.variant_id}>
                  <ListItemText
                    primary={variant.title}
                    secondary={`Extra Price: Rp${variant.extra_price}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>

        {/* Bottom Floating Navbar */}
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
          <IconButton>
            <ShoppingCartIcon sx={{ color: '#1976d2' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Rp{totalPrice.toLocaleString('id-ID')}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              borderRadius: '20px',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            View Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default RestoItems;

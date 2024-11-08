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
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function RestoItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variants, setVariants] = useState([]);

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
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Data Barang
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {items.map((item) => (
          <Paper
            key={item.id_resto_item}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderRadius: 2,
              cursor: 'pointer',
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
                marginRight: '16px'
              }}
            />
            <Box display="flex" flexDirection="column" alignItems="flex-start" flex="1">
              <Typography variant="h6">{item.title}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ marginRight: 1, fontWeight: 'bold' }}
                >
                  Rp{item.base_price}
                </Typography>
                <IconButton
                  sx={{ marginLeft: 2 }}
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event propagation to prevent card click
                    handleCartClick(item.id_resto_item);
                  }}
                >
                  <ShoppingCartIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Modal untuk menampilkan detail item */}
      <Modal
        open={openDetailModal}
        onClose={handleCloseDetail}
        aria-labelledby="item-detail-modal-title"
        aria-describedby="item-detail-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedItem && (
            <>
              <Typography variant="h6" id="item-detail-modal-title" gutterBottom>
                {selectedItem.title}
              </Typography>
              <img
                src={selectedItem.photo}
                alt={selectedItem.title}
                style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  marginBottom: '16px'
                }}
              />
              <Typography variant="body1" gutterBottom>
                {selectedItem.description}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Harga: Rp{selectedItem.base_price}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Stok: {selectedItem.stock}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal untuk menampilkan varian item */}
      <Modal
        open={openCartModal}
        onClose={handleCloseCart}
        aria-labelledby="variant-modal-title"
        aria-describedby="variant-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="variant-modal-title" gutterBottom>
            Varian untuk Item
          </Typography>
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
    </Box>
  );
}

export default RestoItems;

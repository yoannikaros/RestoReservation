// RestoItems.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';

import Navbar from './Navbar';
import ItemList from './ItemList';
import DetailModal from './DetailModal';
import CartModal from './VariantModal';
import { useParams } from 'react-router-dom'; // Import useParams

function RestoItems() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCartModal, setOpenCartModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [variants, setVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [photo, setPhoto] = useState('');
  const [base_price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [id_resto_item, setIdItem] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { id, notabel } = useParams(); // Get both id and notabel from URL



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/resto_items/profile/${id}`);
        setItems(response.data.results.resto_item);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, notabel]);

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
      let fetchedVariants = [];
      let photoUrl = '';
      let priceBase = '';
      let idItem = '';
      let TitleItem = '';

      try {
        const variantResponse = await axios.get(`http://localhost:3000/api/variants/resto_item/${id}`);
        fetchedVariants = variantResponse.data;

        const itemResponse = await axios.get(`http://localhost:3000/api/resto_items/${id}`);
        const item = itemResponse.data.results.resto_item;
        photoUrl = item.photo; // Ambil URL foto dari data item
        priceBase = item.base_price;
        idItem = id;
        TitleItem = item.title;

      } catch (variantError) {
        if (variantError.response && variantError.response.status === 404) {
          console.log("Variants not found, fetching base price instead.");
        } else {
          throw variantError;
        }
      }

      if (fetchedVariants.length > 0) {
        setVariants(fetchedVariants);
      } else {
        const itemResponse = await axios.get(`http://localhost:3000/api/resto_items/${id}`);
        const item = itemResponse.data.results.resto_item;
        photoUrl = item.photo; // Ambil URL foto dari data item
        priceBase = item.base_price;
        idItem = id;
        TitleItem = item.title;

        setVariants([{ title: "Original", extra_price: item.base_price }]);

      }

      setPhoto(photoUrl); // Set state untuk menyimpan URL foto
      setPrice(priceBase);
      setIdItem(idItem);
      setTitle(TitleItem);

      setOpenCartModal(true);
    } catch (error) {
      console.error("Error fetching variants or item details:", error);
      setError("Error fetching variants or item details");
    }
  };


  const handleCloseDetail = () => {
    setOpenDetailModal(false);
    setSelectedItem(null);
  };

  const handleCloseCart = () => {
    setOpenCartModal(false);
    setVariants([]);
    setSelectedVariant({ title: "Pilih varian", extra_price: 0, base_price: 0 }); // Reset selectedVariant on close

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
    // RestoItems.js

    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'hidden'
      }}
    >
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <ItemList items={filteredItems} onOpenDetail={handleOpenDetail} onCartClick={handleCartClick} />
      </Box>

      <DetailModal open={openDetailModal} onClose={handleCloseDetail} selectedItem={selectedItem} />
      <CartModal open={openCartModal} onClose={handleCloseCart} variants={variants} photo={photo} base_price={base_price} profile_id={id} id_resto_item={id_resto_item} title={title} />
    </Box>


  );
}

export default RestoItems;

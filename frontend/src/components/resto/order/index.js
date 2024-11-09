// RestoItems.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';

import Navbar from './Navbar';
import ItemList from './ItemList';
import DetailModal from './DetailModal';
import CartModal from './VariantModal';
import BottomNav from './BottomNav';


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
      let fetchedVariants = [];
  
      // Pertama, coba ambil varian item
      try {
        const variantResponse = await axios.get(`http://localhost:3000/api/variants/resto_item/${id}`);
        fetchedVariants = variantResponse.data;
      } catch (variantError) {
        // Jika respons 404, itu berarti tidak ada varian, kita lanjutkan ke base_price
        if (variantError.response && variantError.response.status === 404) {
          console.log("Variants not found, fetching base price instead.");
        } else {
          throw variantError; // Jika bukan 404, lempar error
        }
      }
  
      if (fetchedVariants.length > 0) {
        setVariants(fetchedVariants);
      } else {
        // Ambil `base_price` dari data `resto_item` jika tidak ada varian
        const itemResponse = await axios.get(`http://localhost:3000/api/resto_items/${id}`);
        const item = itemResponse.data.results.resto_item;
        
        // Set `base_price` sebagai varian default
        setVariants([{ title: "Original", extra_price: item.base_price }]);
      }
  
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
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ItemList items={filteredItems} onOpenDetail={handleOpenDetail} onCartClick={handleCartClick} />
      <DetailModal open={openDetailModal} onClose={handleCloseDetail} selectedItem={selectedItem} />
      <CartModal open={openCartModal} onClose={handleCloseCart} variants={variants} />
      <BottomNav totalPrice={totalPrice} />
    </Box>
  );
}

export default RestoItems;

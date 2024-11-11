// src/components/CategoryModal.js

import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Card, CardContent, Typography } from '@mui/material';

function CategoryModal({ open, onClose, categories, onSelectCategory }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Pilih Kategori</DialogTitle>
      <DialogContent sx={{ padding: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Item "Semua" */}
        <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1 }}>
          <CardContent sx={{ flexGrow: 1, padding: '4px 8px' }}>
            <Typography variant="subtitle1" component="div" sx={{ fontSize: 14 }}>
              Semua
            </Typography>
          </CardContent>
          <Button variant="contained" color="primary" size="small" onClick={() => onSelectCategory(null)}>
            Pilih
          </Button>
        </Card>
        
        {/* Daftar kategori */}
        {categories.map((category) => (
          <Card key={category.id_category} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1 }}>
            <CardContent sx={{ flexGrow: 1, padding: '4px 8px' }}>
              <Typography variant="subtitle1" component="div" sx={{ fontSize: 14 }}>
                {category.title}
              </Typography>
            </CardContent>
            <Button variant="contained" color="primary" size="small" onClick={() => onSelectCategory(category.title)}>
              Pilih
            </Button>
          </Card>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default CategoryModal;

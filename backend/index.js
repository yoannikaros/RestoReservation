// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Tambahkan ini untuk mengakses path
const restoItemRoutes = require('./routes/resto/restoItemRoutes');
const cartRoutes = require('./routes/resto/cartRoutes');
const orderRoutes = require('./routes/resto/orderRoutes');
const variantRoutes = require('./routes/resto/variantRoutes');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

// Routes API
app.use('/api', restoItemRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', variantRoutes);

// Menyajikan static files React dari folder build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route untuk semua request yang tidak dikenali, arahkan ke file index.html React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

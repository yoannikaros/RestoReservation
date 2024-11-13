// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Tambahkan ini untuk mengakses path
const restoItemRoutes = require('./routes/resto/restoItemRoutes');
const cartRoutes = require('./routes/resto/cartRoutes');
const orderRoutes = require('./routes/resto/orderRoutes');
const variantRoutes = require('./routes/resto/variantRoutes');
const restoRoutes = require('./routes/resto/restoRoutes');
const categoryRoutes = require('./routes/resto/categoryRoutes');
const RestoTableRoutes = require('./routes/resto/RestoTableRoutes');
const historyRoutes = require('./routes/resto/historyRoutes');
const paymentRoutes = require('./routes/resto/paymentRoutes');
const restoSettingsRoutes = require('./routes/resto/restoSettingsRoutes');
const orderRealtimeRoutes = require('./routes/resto/orderRealtimeRoutes');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Tambahkan instance io ke app, bukan hanya request
app.set('io', io);

const PORT = 3000;
app.use(bodyParser.json());

// Routes API
app.use('/api', restoItemRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', variantRoutes);
app.use('/api', restoRoutes);
app.use('/api', categoryRoutes);
app.use('/api', RestoTableRoutes);
app.use('/api', historyRoutes);
app.use('/api', paymentRoutes);
app.use('/api', restoSettingsRoutes);
app.use('/api', orderRealtimeRoutes);

// Menyajikan static files React dari folder build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Route untuk semua request yang tidak dikenali, arahkan ke file index.html React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Menjalankan server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

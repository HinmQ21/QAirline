const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const flightRoutes = require('./routes/flight');
const authRoutes = require('./routes/auth');
const airportRoutes = require('./routes/airport');
const airplaneRoutes = require('./routes/airplane');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/airplanes', airplaneRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to QAirline API' });
});

app.use((req, res, next) => {
  console.log(req.body)
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi máy chủ nội bộ',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
}).catch(err => {
  console.error('Không thể kết nối database:', err);
});

module.exports = app;
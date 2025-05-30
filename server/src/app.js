const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const db = require('./models');
const flightRoutes = require('./routes/flight');
const authRoutes = require('./routes/auth');
const airportRoutes = require('./routes/airport');
const airplaneRoutes = require('./routes/airplane');
const bookingRoutes = require('./routes/booking');
const ticketRoutes = require('./routes/ticket');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/airplanes', airplaneRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  console.log('Kết nối đến cơ sở dữ liệu thành công!');
  console.log(`Database: ${process.env.DB_NAME}, Host: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT}`);

  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
}).catch(err => {
  console.error('Không thể kết nối database:', err);
});

module.exports = app;
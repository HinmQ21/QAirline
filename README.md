# QAirline ✈️

**QAirline** là một hệ thống quản lý đặt vé máy bay toàn diện được xây dựng với React và Node.js. Hệ thống cung cấp nền tảng đặt vé trực tuyến cho khách hàng và bảng điều khiển quản trị mạnh mẽ cho nhân viên hãng hàng không.

## 📋 Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt và chạy](#-cài-đặt-và-chạy)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Đóng góp](#-đóng-góp)

## 🚀 Tính năng chính

### Cho khách hàng:
- **🔍 Tìm kiếm chuyến bay**: Tìm kiếm theo điểm đi, điểm đến, ngày bay
- **📱 Đặt vé trực tuyến**: Đặt vé không cần thanh toán online
- **💺 Chọn ghế**: Chọn ghế theo sơ đồ máy bay thực tế
- **📋 Quản lý đặt chỗ**: Xem lịch sử đặt vé, thông tin chuyến bay
- **❌ Hủy vé**: Hủy vé trong thời gian cho phép
- **👤 Quản lý tài khoản**: Cập nhật thông tin cá nhân, đổi mật khẩu
- **📰 Tin tức**: Xem tin tức, khuyến mại từ hãng

### Cho quản trị viên:
- **📊 Dashboard**: Thống kê doanh thu, số lượng đặt vé
- **✈️ Quản lý máy bay**: Thêm, sửa, xóa thông tin máy bay và cấu hình ghế
- **🛫 Quản lý chuyến bay**: Tạo, cập nhật, delay chuyến bay
- **🏢 Quản lý sân bay**: Quản lý danh sách sân bay
- **👥 Quản lý khách hàng**: Xem thông tin khách hàng và đặt chỗ
- **📝 Quản lý tin tức**: Đăng tin tức, thông báo, khuyến mại
- **🎫 Quản lý vé**: Theo dõi và quản lý vé đã bán

## 🛠 Công nghệ sử dụng

### Frontend:
- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Axios** - HTTP Client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend:
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation
- **CORS** - Cross-origin resource sharing

## 📁 Cấu trúc dự án

```
QAirline/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layouts/       # Layout components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── FlightsPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── ...
│   │   ├── services/          # API services
│   │   │   ├── client/        # Client API calls
│   │   │   ├── admin/         # Admin API calls
│   │   │   └── schemes/       # Type definitions
│   │   ├── context/           # React contexts
│   │   ├── layouts/           # Page layouts
│   │   ├── routes/            # Route definitions
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── package.json
│
├── server/                      # Node.js Backend
│   └── src/
│       ├── controllers/        # Request handlers
│       │   ├── auth.js
│       │   ├── flight.js
│       │   ├── booking.js
│       │   ├── admin.js
│       │   └── ...
│       ├── models/            # Database models
│       │   ├── customer.js
│       │   ├── flight.js
│       │   ├── booking.js
│       │   ├── airplane.js
│       │   └── ...
│       ├── routes/            # API routes
│       │   ├── auth.js
│       │   ├── flight.js
│       │   ├── booking.js
│       │   └── ...
│       ├── middleware/        # Custom middleware
│       ├── config/           # Configuration files
│       ├── scripts/          # Setup scripts
│       ├── database/         # Database migrations
│       └── app.js           # Main server file
│
└── README.md
```

## 🔧 Cài đặt và chạy

### Yêu cầu hệ thống:
- Node.js 18+
- MySQL 8.0+
- npm hoặc yarn

### 1. Clone repository:
```bash
git clone <repository-url>
cd QAirline
```

### 2. Cài đặt Backend:
```bash
cd server/src
npm install
```

### 3. Cài đặt Frontend:
```bash
cd ../../frontend
npm install
```

### 4. Cấu hình Database:
Tạo database MySQL và cấu hình file `.env` trong thư mục `server/src/`:

```env
# Database Configuration
DB_NAME=qairline_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 5. Chạy migrations và tạo admin:
```bash
cd server/src
npm run dev # Để tạo bảng database

# Tạo admin user
node scripts/add-admin.js
```

### 6. Khởi động ứng dụng:

**Backend:**
```bash
cd server/src
npm start        # Production
npm run dev      # Development với nodemon
```

**Frontend:**
```bash
cd frontend
npm run dev      # Development
npm run build    # Build for production
```

### 7. Truy cập ứng dụng:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📚 API Documentation

API được document đầy đủ với Swagger. Sau khi chạy backend, truy cập:
- **Swagger UI**: http://localhost:5000/api-docs

### Các API endpoints chính:

#### Authentication:
- `POST /api/auth/register` - Đăng ký khách hàng
- `POST /api/auth/login` - Đăng nhập khách hàng
- `POST /api/auth/admin/login` - Đăng nhập admin
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `DELETE /api/auth/account` - Xóa tài khoản

#### Flights:
- `GET /api/flights` - Lấy danh sách chuyến bay
- `GET /api/flights/search` - Tìm kiếm chuyến bay
- `POST /api/flights` - Tạo chuyến bay (Admin)
- `PUT /api/flights/:id` - Cập nhật chuyến bay (Admin)

#### Bookings:
- `POST /api/bookings` - Đặt vé
- `GET /api/bookings` - Lấy danh sách đặt chỗ
- `GET /api/bookings/:id` - Chi tiết đặt chỗ
- `DELETE /api/bookings/:id` - Hủy đặt chỗ

## 🗄 Database Schema

### Các bảng chính:

- **customers** - Thông tin khách hàng
- **admins** - Thông tin admin
- **airports** - Danh sách sân bay
- **airplanes** - Thông tin máy bay
- **seats** - Cấu hình ghế
- **flights** - Thông tin chuyến bay
- **bookings** - Đặt chỗ
- **tickets** - Vé máy bay
- **news** - Tin tức
- **notifications** - Thông báo

### Quan hệ giữa các bảng:
```
Customer 1:N Booking N:1 Flight
Booking 1:N Ticket N:1 Seat
Flight N:1 Airplane
Flight N:1 Airport (departure/arrival)
Airplane 1:N Seat
```

## 📸 Screenshots

_Thêm screenshots của ứng dụng ở đây_

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Project này được phân phối dưới license MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác giả

- **Development Team** - *Initial work*

## 🙏 Acknowledgments

- shadcn/ui cho component library
- Lucide React cho icons
- React community
- Node.js community

---

### 🔗 Links hữu ích:

- [React Documentation](https://reactjs.org/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Happy Flying with QAirline!** ✈️

const { Admin, Customer, Flight, Booking, Ticket, Airport, Airplane } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get current date and first day of month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count total customers
    const totalCustomers = await Customer.count();

    // Count total flights
    const totalFlights = await Flight.count();

    // Count active flights (departing today or in the future)
    const activeFlights = await Flight.count({
      where: {
        departure_time: {
          [Op.gte]: today
        }
      }
    });

    // Count total bookings
    const totalBookings = await Booking.count();

    // Count bookings this month
    const bookingsThisMonth = await Booking.count({
      where: {
        booking_date: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    // Calculate total revenue
    const allBookings = await Booking.findAll({
      where: {
        status: 'booked'
      },
      attributes: ['total_price']
    });

    const totalRevenue = allBookings.reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);

    // Calculate revenue this month
    const monthBookings = await Booking.findAll({
      where: {
        status: 'booked',
        booking_date: {
          [Op.gte]: firstDayOfMonth
        }
      },
      attributes: ['total_price']
    });

    const revenueThisMonth = monthBookings.reduce((sum, booking) => sum + parseFloat(booking.total_price), 0);
    
    // Total tickets count
    const totalTickets = await Ticket.count();
    
    // Tickets sold today
    const ticketsToday = await Ticket.count({
      include: [{
        model: Booking,
        where: {
          booking_date: {
            [Op.gte]: today
          }
        }
      }]
    });

    res.status(200).json({
      success: true,
      data: {
        customers: {
          total: totalCustomers
        },
        flights: {
          total: totalFlights,
          active: activeFlights
        },
        bookings: {
          total: totalBookings,
          thisMonth: bookingsThisMonth
        },
        tickets: {
          total: totalTickets,
          today: ticketsToday
        },
        revenue: {
          total: totalRevenue,
          thisMonth: revenueThisMonth
        },
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thống kê tổng quan',
      error: error.message
    });
  }
};

// Get all admins (for super_admin only)
exports.getAllAdmins = async (req, res) => {
  try {
    // Check if super_admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xem danh sách quản trị viên'
      });
    }

    const admins = await Admin.findAll({
      attributes: ['admin_id', 'username', 'email', 'full_name', 'role'],
      order: [['admin_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách quản trị viên',
      error: error.message
    });
  }
};

// Create new admin (for super_admin only)
exports.createAdmin = async (req, res) => {
  try {
    // Check if super_admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền tạo quản trị viên mới'
      });
    }

    const { username, password, email, full_name, role } = req.body;

    // Validate input
    if (!username || !password || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }

    // Check if role is valid
    const validRoles = ['flight_manager', 'news_manager', 'super_admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Loại tài khoản không hợp lệ'
      });
    }

    // Check if username already exists
    const existingUsername = await Admin.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã tồn tại'
      });
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      email,
      full_name: full_name || '',
      role
    });

    res.status(201).json({
      success: true,
      message: 'Tạo quản trị viên mới thành công',
      data: {
        admin_id: newAdmin.admin_id,
        username: newAdmin.username,
        email: newAdmin.email,
        full_name: newAdmin.full_name,
        role: newAdmin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo quản trị viên mới',
      error: error.message
    });
  }
};

// Update admin (for super_admin only)
exports.updateAdmin = async (req, res) => {
  try {
    // Check if super_admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật thông tin quản trị viên'
      });
    }

    const { admin_id } = req.params;
    const { email, full_name, role } = req.body;

    // Find admin
    const admin = await Admin.findByPk(admin_id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quản trị viên'
      });
    }

    // Prevent updating the super admin that is currently logged in
    if (admin.admin_id === req.admin.admin_id && admin.role === 'super_admin' && role && role !== 'super_admin') {
      return res.status(400).json({
        success: false,
        message: 'Không thể thay đổi quyền của tài khoản super admin hiện tại'
      });
    }

    // Check if role is valid
    if (role) {
      const validRoles = ['flight_manager', 'news_manager', 'super_admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Loại tài khoản không hợp lệ'
        });
      }
    }

    // Check if email is already taken (if changing email)
    if (email && email !== admin.email) {
      const existingEmail = await Admin.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng bởi tài khoản khác'
        });
      }
    }

    // Update admin
    await admin.update({
      email: email || admin.email,
      full_name: full_name || admin.full_name,
      role: role || admin.role
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin quản trị viên thành công',
      data: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thông tin quản trị viên',
      error: error.message
    });
  }
};

// Delete admin (for super_admin only)
exports.deleteAdmin = async (req, res) => {
  try {
    // Check if super_admin
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa quản trị viên'
      });
    }

    const { admin_id } = req.params;

    // Find admin
    const admin = await Admin.findByPk(admin_id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quản trị viên'
      });
    }

    // Prevent deleting themselves
    if (admin.admin_id === req.admin.admin_id) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản quản trị viên đang đăng nhập'
      });
    }

    // Delete admin
    await admin.destroy();

    res.status(200).json({
      success: true,
      message: 'Xóa quản trị viên thành công'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa quản trị viên',
      error: error.message
    });
  }
};
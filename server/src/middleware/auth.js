const jwt = require('jsonwebtoken');
const { Admin, Customer } = require('../models');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực, vui lòng đăng nhập'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const admin = await Admin.findByPk(decoded.admin_id);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không có quyền truy cập'
      });
    }
    
    req.admin = {
      admin_id: admin.admin_id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ, vui lòng đăng nhập lại'
    });
  }
};

// Middleware kiểm tra quyền flight_manager hoặc super_admin
exports.checkFlightManagerPermission = (req, res, next) => {
  if (req.admin && (req.admin.role === 'flight_manager' || req.admin.role === 'super_admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền quản lý chuyến bay'
    });
  }
};

// User authentication middleware
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực, vui lòng đăng nhập'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the token contains customer_id
    if (!decoded.customer_id) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ cho người dùng'
      });
    }
    
    const user = await Customer.findByPk(decoded.customer_id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }
    
    req.user = {
      customer_id: user.customer_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address
    };
    
    next();
  } catch (error) {
    console.error('User auth error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ, vui lòng đăng nhập lại'
    });
  }
};
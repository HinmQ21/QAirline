const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    
    // Lưu thông tin admin vào request
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
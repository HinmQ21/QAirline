const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kiểm tra input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp username và password'
      });
    }
    
    // Tìm admin theo username
    const admin = await Admin.findOne({ where: { username } });
    
    // Kiểm tra admin tồn tại
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { 
        admin_id: admin.admin_id,
        username: admin.username,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập',
      error: error.message
    });
  }
};

// Lấy thông tin admin hiện tại từ token
exports.getCurrentAdmin = async (req, res) => {
  try {
    // Thông tin admin đã được lưu từ middleware auth
    const admin = req.admin;
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin admin'
      });
    }
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin admin',
      error: error.message
    });
  }
};
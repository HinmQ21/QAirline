const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Customer } = require('../models');

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

    // Tạm thời không  dùng bcrypt
    // const isMatch = password === admin.password;
    
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
      data: admin,
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

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, email, full_name, phone, address } = req.body;
    
    // Validate input
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp username, password và email'
      });
    }
    
    // Check if username already exists
    const existingUsername = await Customer.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }
    
    // Check if email already exists
    const existingEmail = await Customer.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await Customer.create({
      username,
      password: hashedPassword,
      email,
      full_name: full_name || '',
      phone: phone || '',
      address: address || ''
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        customer_id: newUser.customer_id,
        username: newUser.username
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        customer_id: newUser.customer_id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký',
      error: error.message
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp username và password'
      });
    }
    
    // Find user by username
    const user = await Customer.findOne({ where: { username } });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Username hoặc password không chính xác 1111'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        customer_id: user.customer_id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        customer_id: user.customer_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
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

// Get current user information
exports.getCurrentUser = async (req, res) => {
  try {
    // User info is stored in req.user from the auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
      error: error.message
    });
  }
};
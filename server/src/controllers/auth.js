const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Customer } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Create access token for user or admin
 * @param {Object} user - User or admin object containing identification data
 * @param {String} userType - Type of user ('admin' or 'customer')
 * @returns {String} Access token
 */
const createAccessToken = (user, userType = 'customer') => {
  const payload = userType === 'admin' 
    ? { 
        admin_id: user.admin_id,
        username: user.username,
        role: user.role,
        type: 'admin'
      }
    : { 
        customer_id: user.customer_id,
        username: user.username,
        type: 'customer'
      };

  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Create refresh token for user or admin
 * @param {Object} user - User or admin object containing identification data
 * @param {String} userType - Type of user ('admin' or 'customer')
 * @returns {String} Refresh token
 */
const createRefreshToken = (user, userType = 'customer') => {
  const payload = userType === 'admin'
    ? { 
        admin_id: user.admin_id,
        username: user.username,
        type: 'admin'
      }
    : { 
        customer_id: user.customer_id,
        username: user.username,
        type: 'customer'
      };

  return jwt.sign(
    payload,
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

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
      return res.status(400).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, admin.password);

    // Tạm thời không  dùng bcrypt
    // const isMatch = password === admin.password;
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Tạo JWT tokens
    const accessToken = createAccessToken(admin, 'admin');
    const refreshToken = createRefreshToken(admin, 'admin');
    
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
      accessToken,
      refreshToken
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
    
    // Generate JWT tokens
    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        customer_id: newUser.customer_id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name
      },
      accessToken,
      refreshToken
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
      return res.status(400).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Username hoặc password không chính xác'
      });
    }
    
    // Generate JWT tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        customer_id: user.customer_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      },
      accessToken,
      refreshToken
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
      data: user,
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

// Update customer profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { customer_id } = req.user;
    const { email, full_name, phone, address } = req.body;
    
    // Find user
    const user = await Customer.findByPk(customer_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    // Check if email is already taken (if changing email)
    if (email && email !== user.email) {
      const existingEmail = await Customer.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng bởi tài khoản khác'
        });
      }
    }
    
    // Update user information
    await user.update({
      email: email || user.email,
      full_name: full_name || user.full_name,
      phone: phone || user.phone,
      address: address || user.address
    });
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        customer_id: user.customer_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thông tin',
      error: error.message
    });
  }
};

// Delete customer account
exports.deleteCustomerAccount = async (req, res) => {
  try {
    const { customer_id } = req.user;
    
    // Check if user exists
    const user = await Customer.findByPk(customer_id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    // Check if user has active bookings
    const activeBookings = await user.getBookings({
      where: {
        status: ['booked']
      }
    });
    
    if (activeBookings && activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản khi còn đơn đặt vé đang hoạt động'
      });
    }
    
    // Delete user
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Xóa tài khoản thành công'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa tài khoản',
      error: error.message
    });
  }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Public (with refresh token)
 */
exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    // Get user based on token type
    let user;
    
    if (decoded.type === 'admin') {
      user = await Admin.findByPk(decoded.admin_id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Admin không tồn tại'
        });
      }
      
      // Generate new access token
      const accessToken = createAccessToken(user, 'admin');
      
      return res.status(200).json({
        success: true,
        accessToken
      });
    } else {
      user = await Customer.findByPk(decoded.customer_id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Người dùng không tồn tại'
        });
      }
      
      // Generate new access token
      const accessToken = createAccessToken(user);
      
      return res.status(200).json({
        success: true,
        accessToken
      });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token đã hết hạn, vui lòng đăng nhập lại'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Refresh token không hợp lệ, vui lòng đăng nhập lại'
    });
  }
};

/**
 * @desc    Logout user or admin
 * @route   POST /api/auth/logout
 * @access  Public (with refresh token)
 */
exports.logout = async (req, res) => {
  try {
    // In a real production environment, you would invalidate the refresh token here
    // This would involve storing it in a blacklist or marking it as invalid in the database
    
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng xuất',
      error: error.message
    });
  }
};

/**
 * @desc    Revoke all tokens for the current user
 * @route   POST /api/auth/revoke-all-tokens
 * @access  Private (User or Admin)
 */
exports.revokeAllTokens = async (req, res) => {
  try {
    let userId, userType;
    
    // Determine if the request is from an admin or a customer
    if (req.admin) {
      userId = req.admin.admin_id;
      userType = 'admin';
    } else if (req.user) {
      userId = req.user.customer_id;
      userType = 'customer';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not authenticated'
      });
    }
    
    // In a real production environment, you would invalidate all refresh tokens for this user
    // This would involve storing token info in a database and marking them as invalid
    
    res.status(200).json({
      success: true,
      message: 'Đã đăng xuất khỏi tất cả các thiết bị'
    });
  } catch (error) {
    console.error('Revoke all tokens error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng xuất khỏi các thiết bị',
      error: error.message
    });
  }
};
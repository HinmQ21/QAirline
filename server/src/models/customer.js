// models/customer.js
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      full_name: {
        type: DataTypes.STRING(100)
      },
      phone: {
        type: DataTypes.STRING(20),
        validate: {
          // Kiểm tra định dạng số điện thoại
          is: /^[0-9+\-\s()]*$/i
        }
      },
      address: {
        type: DataTypes.TEXT
      }
    }, {
      tableName: 'customer',
      timestamps: false
    });
  
    return Customer;
  };
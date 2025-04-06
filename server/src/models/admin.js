module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
      admin_id: {
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
      role: {
        type: DataTypes.ENUM('flight_manager', 'news_manager', 'super_admin'),
        defaultValue: 'flight_manager'
      }
    }, {
      tableName: 'admin',
      timestamps: false
    });
  
    return Admin;
  };
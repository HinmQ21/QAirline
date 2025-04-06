// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'customer',
          key: 'customer_id'
        }
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'flight',
          key: 'flight_id'
        }
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      type: {
        type: DataTypes.ENUM('delay', 'cancellation', 'general'),
        defaultValue: 'general'
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'notification',
      timestamps: false
    });
  
    return Notification;
  };
// models/booking.js
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
      booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'customer',
          key: 'customer_id'
        }
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'flight',
          key: 'flight_id'
        }
      },
      booking_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM('booked', 'cancelled'),
        defaultValue: 'booked'
      },
      total_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      }
    }, {
      tableName: 'booking',
      timestamps: false
    });
  
    return Booking;
  };
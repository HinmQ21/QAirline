// models/ticket.js
module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
      ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'booking',
          key: 'booking_id'
        }
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'seat',
          key: 'seat_id'
        }
      },
      passenger_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      passenger_dob: {
        type: DataTypes.DATEONLY
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      }
    }, {
      tableName: 'ticket',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['seat_id', 'booking_id']
        }
      ]
    });
  
    return Ticket;
  };
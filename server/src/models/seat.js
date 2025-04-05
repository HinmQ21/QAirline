// models/seat.js
module.exports = (sequelize, DataTypes) => {
    const Seat = sequelize.define('Seat', {
      seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      airplane_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'airplane',
          key: 'airplane_id'
        }
      },
      seat_number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      class: {
        type: DataTypes.ENUM('economy', 'business', 'first'),
        defaultValue: 'economy'
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'seat',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['airplane_id', 'seat_number']
        }
      ]
    });
  
    return Seat;
  };
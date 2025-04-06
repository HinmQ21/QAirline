// models/flight.js
module.exports = (sequelize, DataTypes) => {
    const Flight = sequelize.define('Flight', {
      flight_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      flight_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      airplane_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'airplane',
          key: 'airplane_id'
        }
      },
      departure_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'airport',
          key: 'airport_id'
        }
      },
      arrival_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'airport',
          key: 'airport_id'
        }
      },
      departure_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfterDeparture(value) {
            if (value <= this.departure_time) {
              throw new Error('Arrival time must be after departure time');
            }
          }
        }
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'delayed', 'cancelled'),
        defaultValue: 'scheduled'
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin',
          key: 'admin_id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'admin',
          key: 'admin_id'
        }
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'flight',
      timestamps: false,
      hooks: {
        beforeUpdate: (flight) => {
          flight.updated_at = new Date();
        }
      }
    });
  
    return Flight;
  };
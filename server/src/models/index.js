const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions,
    pool: config.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Admin = require('./admin')(sequelize, DataTypes);
db.Airport = require('./airport')(sequelize, DataTypes);
db.Airplane = require('./airplane')(sequelize, DataTypes);
db.Seat = require('./seat')(sequelize, DataTypes);
db.Flight = require('./flight')(sequelize, DataTypes);
db.Customer = require('./customer')(sequelize, DataTypes);
db.Booking = require('./booking')(sequelize, DataTypes);
db.Ticket = require('./ticket')(sequelize, DataTypes);
db.News = require('./news')(sequelize, DataTypes);
db.Notification = require('./notification')(sequelize, DataTypes);

// Define associations
// Airplane - Seat (One-to-Many)
db.Airplane.hasMany(db.Seat, { foreignKey: 'airplane_id' });
db.Seat.belongsTo(db.Airplane, { foreignKey: 'airplane_id' });

// Airport - Flight (One-to-Many) as departure airport
db.Airport.hasMany(db.Flight, { foreignKey: 'departure_airport_id', as: 'departureFlights' });
db.Flight.belongsTo(db.Airport, { foreignKey: 'departure_airport_id', as: 'departureAirport' });

// Airport - Flight (One-to-Many) as arrival airport
db.Airport.hasMany(db.Flight, { foreignKey: 'arrival_airport_id', as: 'arrivalFlights' });
db.Flight.belongsTo(db.Airport, { foreignKey: 'arrival_airport_id', as: 'arrivalAirport' });

// Airplane - Flight (One-to-Many)
db.Airplane.hasMany(db.Flight, { foreignKey: 'airplane_id' });
db.Flight.belongsTo(db.Airplane, { foreignKey: 'airplane_id' });

// Admin - Flight (One-to-Many) as creator
db.Admin.hasMany(db.Flight, { foreignKey: 'created_by', as: 'createdFlights' });
db.Flight.belongsTo(db.Admin, { foreignKey: 'created_by', as: 'creator' });

// Admin - Flight (One-to-Many) as updater
db.Admin.hasMany(db.Flight, { foreignKey: 'updated_by', as: 'updatedFlights' });
db.Flight.belongsTo(db.Admin, { foreignKey: 'updated_by', as: 'updater' });

// Customer - Booking (One-to-Many)
db.Customer.hasMany(db.Booking, { foreignKey: 'customer_id' });
db.Booking.belongsTo(db.Customer, { foreignKey: 'customer_id' });

// Flight - Booking (One-to-Many)
db.Flight.hasMany(db.Booking, { foreignKey: 'flight_id' });
db.Booking.belongsTo(db.Flight, { foreignKey: 'flight_id' });

// Booking - Ticket (One-to-Many)
db.Booking.hasMany(db.Ticket, { foreignKey: 'booking_id' });
db.Ticket.belongsTo(db.Booking, { foreignKey: 'booking_id' });

// Seat - Ticket (One-to-Many)
db.Seat.hasMany(db.Ticket, { foreignKey: 'seat_id' });
db.Ticket.belongsTo(db.Seat, { foreignKey: 'seat_id' });

// Admin - News (One-to-Many)
db.Admin.hasMany(db.News, { foreignKey: 'created_by' });
db.News.belongsTo(db.Admin, { foreignKey: 'created_by', as: 'admin' });

// Customer - Notification (One-to-Many)
db.Customer.hasMany(db.Notification, { foreignKey: 'customer_id' });
db.Notification.belongsTo(db.Customer, { foreignKey: 'customer_id' });

// Flight - Notification (One-to-Many)
db.Flight.hasMany(db.Notification, { foreignKey: 'flight_id' });
db.Notification.belongsTo(db.Flight, { foreignKey: 'flight_id' });

module.exports = db;
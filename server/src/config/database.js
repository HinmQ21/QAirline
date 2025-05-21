require('dotenv').config();

module.exports = {
    database: process.env.DB_NAME || 'qairline_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 60000,
    },
    logging: false
};

const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Xác định URL server Swagger trên Render hoặc local
const isProd = process.env.NODE_ENV === 'production';
const renderUrl = process.env.RENDER_EXTERNAL_URL; // Render tự động cung cấp
const serverUrl = isProd && renderUrl
  ? `https://${renderUrl}`
  : `http://localhost:${process.env.PORT || 5000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QAirline API',
      version: '1.0.0',
      description: 'API documentation for the QAirline application',
    },
    servers: [
      {
        url: serverUrl,
        description: isProd ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Nếu hầu hết endpoint yêu cầu auth, bạn có thể bật:
    // security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../routes/**/*.js'),
    path.join(__dirname, '../models/**/*.js'),
  ],
};

module.exports = swaggerJsdoc(options);

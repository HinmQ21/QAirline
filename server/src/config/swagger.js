const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Xác định URL của server Swagger dựa vào môi trường
const serverUrl = process.env.SWAGGER_SERVER_URL
  || (process.env.NODE_ENV === 'production'
    ? `https://${process.env.RENDER_EXTERNAL_URL || `${process.env.RENDER_SERVICE_NAME}.onrender.com`}`
    : `http://localhost:${process.env.PORT || 5000}`);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QAirline API', // Thay đổi tên nếu cần
      version: '1.0.0',
      description: 'API documentation for the QAirline application',
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // Define the security scheme (e.g., JWT Bearer token)
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // Nếu hầu hết endpoint yêu cầu auth, bạn có thể mở comment
    // security: [{ bearerAuth: [] }],
  },
  // Path to the API docs files relative to the project root
  // swaggerDefinition needs to know where to find the JSDoc comments
  // Adjust the glob pattern if your route/model files are located differently
  apis: [
      path.join(__dirname, '../routes/**/*.js'), 
      path.join(__dirname, '../models/**/*.js') // Include models if they contain schema definitions
    ], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;

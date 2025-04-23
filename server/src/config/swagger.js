const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        // Adjust the URL based on your environment variable or actual server address
        url: `http://localhost:${process.env.PORT || 5000}`, 
        description: 'Development server',
      },
      // Add more servers if needed (e.g., production)
      // {
      //   url: 'https://api.qairline.com', // Example production URL
      //   description: 'Production server',
      // },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // Define the security scheme (e.g., JWT Bearer token)
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // Define reusable schemas, parameters, responses etc. here
      // schemas: {
      //   ErrorResponse: {
      //     type: 'object',
      //     properties: {
      //       message: { type: 'string', description: 'Error message' },
      //       error: { type: 'object', description: 'Optional error details' },
      //     },
      //     required: ['message'],
      //   },
      // },
    },
    // Apply security globally if most endpoints require authentication
    // security: [
    //   {
    //     bearerAuth: [], 
    //   },
    // ],
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
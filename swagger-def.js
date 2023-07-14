const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Shoperz E-Commerce API',
    version: '1.0.0',
    description: 'This is an e-commerce REST API made with Express.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Shoperz',
      url: '',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server',
    },
    {
      url: 'https://shoperz-api.vercel.app/api/v1',
      description: 'Production server',
    },
  ],
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ["src/**/*.js"],
});

module.exports = swaggerSpec



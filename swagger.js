// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sleep Assessment API",
      version: "1.0.0",
      description: "API documentation for the Sleep Assessment application",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Adjust the URL based on your server
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files to auto-generate docs
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;

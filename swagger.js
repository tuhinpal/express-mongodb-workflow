const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, {
  info: {
    title: "Express MongoDB Workflow",
    description:
      "You should follow this workflow to build your easily maintainable, secure API with ExpressJS and MongoDB.",
  },
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "authorization",
      description:
        "Your jwt session token. You can retrive it by signin or signup",
    },
    host: process.env.APPLICATION_HOST || "localhost:3000",
    schemes: ["http", "https"],
  },
});

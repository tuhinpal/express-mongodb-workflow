const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./docs/swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, {
  info: {
    title: "Express MongoDB Workflow",
    description:
      "You should follow this workflow to build your easily maintainable, secure API with ExpressJS and MongoDB.",
  },
});

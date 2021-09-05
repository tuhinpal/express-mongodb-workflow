const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(require("./docs/swagger.json"))
); // swagger-ui-express
app.use("/public", require("./routes/public")); // Public routes
app.use("/private", require("./routes/private")); // Private routes

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

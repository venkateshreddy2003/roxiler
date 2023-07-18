const express = require("express");
const {
  initializeDatabase,
  statisticsCtrl,
  barChartCtrl,
  pieChartCtrl,
  combinedDatactrl,
} = require("../../controllers/Product/productController");
const productRoute = express.Router();
// Route for initializing the database
productRoute.get("/api/initialize-database", initializeDatabase);

// Route for statistics
productRoute.get("/api/statistics", statisticsCtrl);

// Route for bar chart
productRoute.get("/api/bar-chart", barChartCtrl);

// Route for pie chart
productRoute.get("/api/pie-chart", pieChartCtrl);

// Route for combined response
productRoute.get("/api/combined-data", combinedDatactrl);

module.exports = productRoute;

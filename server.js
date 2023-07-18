const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/DB/dbConnect");
const {
  statisticsCtrl,
  barChartCtrl,
  pieChartCtrl,
  combinedDatactrl,
  initializeDatabase,
} = require("./controllers/Product/productController");
const productRoute = require("./routes/product/productRoute");
app.use(cors());
// Database connection setup
dbConnect();

app.use(productRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));

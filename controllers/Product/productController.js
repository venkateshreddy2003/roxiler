const axios = require("axios");
const Product = require("../../model/Product/Product");
const initializeDatabase = async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Save the data to the database
    await Product.insertMany(response.data);

    res.send("Database initialized successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while initializing the database");
  }
};
const statisticsCtrl = async (req, res) => {
  try {
    const { month } = req.query;

    // Calculate the total sale amount
    const totalSaleAmount = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
          },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    // Calculate the total number of sold items
    const totalSoldItems = await Product.countDocuments({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
      },
      sold: true,
    });

    // Calculate the total number of not sold items
    const totalNotSoldItems = await Product.countDocuments({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
      },
      sold: false,
    });

    res.json({
      totalSaleAmount:
        totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching statistics");
  }
};
const barChartCtrl = async (req, res) => {
  try {
    const { month } = req.query;

    // Group the items by price range and count the number of items in each range
    const priceRanges = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
          },
        },
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$price", 100] }, then: "0-100" },
                { case: { $lte: ["$price", 200] }, then: "101-200" },
                { case: { $lte: ["$price", 300] }, then: "201-300" },
                { case: { $lte: ["$price", 400] }, then: "301-400" },
                { case: { $lte: ["$price", 500] }, then: "401-500" },
                { case: { $lte: ["$price", 600] }, then: "501-600" },
                { case: { $lte: ["$price", 700] }, then: "601-700" },
                { case: { $lte: ["$price", 800] }, then: "701-800" },
                { case: { $lte: ["$price", 900] }, then: "801-900" },
              ],
              default: "901-above",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(priceRanges);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching bar chart data");
  }
};
const pieChartCtrl = async (req, res) => {
  try {
    const { month } = req.query;

    // Group the items by category and count the number of items in each category
    const categories = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching pie chart data");
  }
};
const combinedDatactrl = async (req, res) => {
  try {
    const { month } = req.query;

    const statistics = await axios.get(`/api/statistics?month=${month}`);
    const barChart = await axios.get(`/api/bar-chart?month=${month}`);
    const pieChart = await axios.get(`/api/pie-chart?month=${month}`);

    const combinedData = {
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    };

    res.json(combinedData);
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  statisticsCtrl,
  barChartCtrl,
  pieChartCtrl,
  combinedDatactrl,
  initializeDatabase,
};

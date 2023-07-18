const mongoose = require("mongoose");

// Define the data schema
const productSchema = new mongoose.Schema({
  // Define the schema fields based on the JSON structure
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

// Create a model based on the schema
const Product = mongoose.model("Product", productSchema);
module.exports = Product;

const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema({
  title: String,
  description: String,
  releaseYear: String,
  rating: String,
  seasons: String,
  image: String,
  trailer: String,
  genre: [String],
});

module.exports = mongoose.model("TVShow", tvShowSchema);

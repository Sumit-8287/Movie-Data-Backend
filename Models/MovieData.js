const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  year: { type: Number, required: true },
  img: { type: String, required: true },
});

module.exports = mongoose.model("Movie", movieSchema);

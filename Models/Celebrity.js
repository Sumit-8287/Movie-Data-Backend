const mongoose = require("mongoose");

const celebritySchema = new mongoose.Schema({
  name: String,
  bio: String,
  birthDate: String,
  image: String,
  knownFor: [String],
});

module.exports = mongoose.model("Celebrity", celebritySchema);

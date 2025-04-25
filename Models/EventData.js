const mongoose = require("mongoose");

const awardEventSchema = new mongoose.Schema({
  title: String,
  description: String,
  year: String,
  image: String,
  hostedBy: String,
});

module.exports = mongoose.model("AwardEvent", awardEventSchema);

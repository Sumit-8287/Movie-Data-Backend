const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "Admin"], default: "user" },
});

module.exports = mongoose.model("User", UserSchema);

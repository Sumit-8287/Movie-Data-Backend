const express = require("express");
const connectDB = require("./database");
require("dotenv").config();
const cors = require("cors");
const Movie = require("./Models/MovieData");
const bcrypt = require("bcrypt");
const app = express();
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.post("/register-movies", async (req, res) => {
  try {
    const movies = req.body;
    if (!Array.isArray(movies)) {
      return res
        .status(400)
        .json({ message: "Data should be an array of movies" });
    }

    const result = await Movie.insertMany(movies);
    return res
      .status(200)
      .json({ message: "Movies saved successfully", data: result });
  } catch (error) {
    console.error(" Bulk insert error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/all-Movies", async (req, res) => {
  try {
    const Movies = await Movie.find();
    res.json(Movies);
  } catch (error) {
    res.status(502).json({ message: "error in getting course", error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `server is running on localhost:${process.env.PORT} thank you so much `
  );
});

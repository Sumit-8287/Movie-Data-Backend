const express = require("express");
const connectDB = require("./database");
require("dotenv").config();
const cors = require("cors");
const verifyToken = require("./middleware/verifyToken");
const { authorizeRole, authMiddleware } = require("./middleware/authorization");
const Movie = require("./Models/MovieData");
const User = require("./Models/User");
const jwt = require("jsonwebtoken");
const AwardEvent = require("./Models/EventData");
const TvShows = require("./Models/TvShows");
const Celebrity = require("./Models/Celebrity");

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

app.post("/register-celebrities", async (req, res) => {
  try {
    const data = req.body;

    // Check if it's an array (bulk insert)
    if (Array.isArray(data)) {
      const result = await Celebrity.insertMany(data);
      return res
        .status(200)
        .json({ message: "Celebrities saved successfully", data: result });
    }

    // Otherwise handle single insert
    const newCelebrity = new Celebrity(data);
    const savedCelebrity = await newCelebrity.save();
    return res
      .status(201)
      .json({ message: "Celebrity saved successfully", data: savedCelebrity });
  } catch (error) {
    console.error("Celebrity insert error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/all-Celebrity", async (req, res) => {
  try {
    const celebrities = await Celebrity.find();
    res.status(200).json(celebrities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register-tvshows", async (req, res) => {
  try {
    const data = req.body;

    // Check if data is an array (bulk insert)
    if (Array.isArray(data)) {
      const result = await TvShows.insertMany(data);
      return res
        .status(200)
        .json({ message: "TV shows saved successfully", data: result });
    }

    // Otherwise handle single insert
    const newShow = new TVShow(data);
    const savedShow = await newShow.save();
    return res
      .status(201)
      .json({ message: "TV show saved successfully", data: savedShow });
  } catch (error) {
    console.error("TV show insert error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/all-tvshow", async (req, res) => {
  try {
    const shows = await TvShows.find();
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registerevent", async (req, res) => {
  try {
    const dataArray = req.body;
    const inserted = await AwardEvent.insertMany(dataArray);
    res
      .status(201)
      .json({ message: "All events registered successfully", inserted });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to register events", details: error.message });
  }
});

app.get("/all-events", async (req, res) => {
  try {
    const allEvents = await AwardEvent.find();
    res.status(200).json(allEvents);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch events", details: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      boardData: { boards: [], activeBoardId: null },
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering the user:\n", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user info and token
    res.status(200).json({
      message: "Login successful 🚀",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:\n", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `server is running on localhost:${process.env.PORT} thank you so much `
  );
});

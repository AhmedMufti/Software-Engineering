// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const registrationmodel = require('./models/User.js')
require("dotenv").config();


const app = express();

// Security: Set secure HTTP headers with Helmet
app.use(helmet());

// Logging: Use Morgan to log HTTP requests
app.use(morgan("combined"));

// CORS: Allow requests from your frontend domain (change origin as needed)
app.use(cors({
  origin: "http://localhost:3000", // adjust for your production frontend URL
  optionsSuccessStatus: 200
}));

// Body parser: Enable JSON parsing
app.use(express.json());

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Use authentication routes (we’ll create these next)
app.use("/api/auth", require("./routes/auth"));

// Global Error Handler: Catches unhandled errors and logs them
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server Error" });
});

// Start the server on specified PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

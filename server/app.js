const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimitingMiddleware = require("./middlewares/RateLimiting"); // Import the rate limiting middleware

dotenv.config();

const analyzeRoutes = require("./routes/analyze");
const spellCheckRoutes = require("./routes/spellcheck");
const grammarCheckRoutes = require("./routes/grammarcheck");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(rateLimitingMiddleware); // Apply rate limiting middleware globally or to specific routes

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/analyze", rateLimitingMiddleware, analyzeRoutes);
app.use("/api/spellcheck", rateLimitingMiddleware, spellCheckRoutes);
app.use("/api/grammarcheck", rateLimitingMiddleware ,grammarCheckRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

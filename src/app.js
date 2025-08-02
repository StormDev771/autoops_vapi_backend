const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Add this line
const { connectDB } = require("./config/db");
const {
  authRoutes,
  n8n_deployRoutes,
  vapi_deployRoutes,
} = require("./routes/index");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri =
  "mongodb+srv://stormdev771:qweqweqwe@cluster0.tg5nv9c.mongodb.net/AutoOps";

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deploy", n8n_deployRoutes);
app.use("/api/vapi", vapi_deployRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to MongoDB and start server
connectDB(app, PORT, uri);

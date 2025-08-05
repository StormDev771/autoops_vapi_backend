const express = require("express");
const marketplacesController = require("../controllers/marketplacesController");

const router = express.Router();

// Route for user registration
router.get("/list", marketplacesController.getClientsHandler);

module.exports = router;

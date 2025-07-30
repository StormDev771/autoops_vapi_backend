// routes/deployRoutes.js
const express = require("express");
const router = express.Router();
const {
  deployWorkflowHandler,
} = require("../controllers/n8n_deployController");

router.post("/n8n", deployWorkflowHandler);

module.exports = router;

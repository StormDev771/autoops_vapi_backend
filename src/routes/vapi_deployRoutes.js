// routes/vapiRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAgentHandler,
  assignPhoneToAgent,
} = require("../controllers/vapi_deployController");

router.post("/agent/create", createAgentHandler);
router.post("/agent/assignTn", assignPhoneToAgent);

module.exports = router;

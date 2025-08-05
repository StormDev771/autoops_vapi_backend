// routes/vapiRoutes.js
const express = require("express");
const router = express.Router();
const {
  toolGetVehicleByPhoneHandler,
  toolSuggestAppointmentSlotsHandler,
  toolBookAppointmentHandler,
  assignToolToAgentHandler,
} = require("../controllers/vapi_toolController");

router.post("/toolGetVehicleByPhone", toolGetVehicleByPhoneHandler);
router.post("/toolSuggestApptSlots", toolSuggestAppointmentSlotsHandler);
router.post("/toolBookAppt", toolBookAppointmentHandler);
router.post("/toolAssignToAgent", assignToolToAgentHandler);

module.exports = router;

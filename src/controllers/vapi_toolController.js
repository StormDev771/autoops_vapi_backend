const {
  toolGetVehicleByPhone,
  toolSuggestAppointmentSlots,
  toolBookAppointment,
  assignToolToAgent,
} = require("../services/vapi_toolService");

const toolGetVehicleByPhoneHandler = async (req, res) => {
  const { uuid, name } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const result = await toolGetVehicleByPhone(uuid, name);
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    console.error("❌ Error fetching vehicle by phone:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const toolSuggestAppointmentSlotsHandler = async (req, res) => {
  const { uuid, name } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: "Service name is required" });
  }

  try {
    const result = await toolSuggestAppointmentSlots(uuid, name);
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    console.error("❌ Error suggesting appointment slots:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const toolBookAppointmentHandler = async (req, res) => {
  const { uuid, name } = req.body;

  if (!uuid) {
    return res.status(400).json({ error: "Appointment details are required" });
  }

  try {
    const result = await toolBookAppointment(uuid, name);
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    console.error("❌ Error booking appointment:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const assignToolToAgentHandler = async (req, res) => {
  const { agentId, toolIds } = req.body;

  if (!agentId || !toolIds || !Array.isArray(toolIds)) {
    return res
      .status(400)
      .json({ error: "Agent ID and tool IDs are required" });
  }

  try {
    const result = await assignToolToAgent(agentId, toolIds);
    return res.status(200).json({ status: "success", data: result });
  } catch (err) {
    console.error("❌ Error assigning tool to agent:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  toolGetVehicleByPhoneHandler,
  toolSuggestAppointmentSlotsHandler,
  toolBookAppointmentHandler,
  assignToolToAgentHandler,
};

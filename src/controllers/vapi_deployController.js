// controllers/vapiController.js
const { createAgent } = require("../services/vapi_deployService");
const {
  createPhoneNumber,
  assignPhoneNumber,
} = require("../services/vapi_phoneService");

const createAgentHandler = async (req, res) => {
  try {
    const agent = await createAgent();

    return res.status(200).json({
      message: "Voice agent generated successfully!",
      agent,
    });
  } catch (err) {
    console.error("❌ Vapi error:", err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
};

const assignPhoneToAgent = async (req, res) => {
  const { agentId } = req.body;

  if (!agentId) {
    return res.status(400).json({ error: "Agent ID is required" });
  }

  try {
    const phone = await createPhoneNumber();
    if (!phone || !phone.id) {
      throw new Error("Failed to create phone number");
    }
    const assignState = await assignPhoneNumber(agentId, phone.id);
    if (!assignState || !assignState.id) {
      throw new Error("Failed to assign phone number to agent");
    }
    return res.status(200).json({
      message: "Phone number assigned successfully!",
      phone: assignState,
    });
  } catch (error) {
    console.error("❌ Error assigning phone number:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAgentHandler,
  assignPhoneToAgent,
};

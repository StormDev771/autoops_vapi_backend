// controllers/deployController.js
const { deployWorkflow } = require("../services/n8n_deployService");

const deployWorkflowHandler = async (req, res) => {
  const { id, name, type } = req.body;

  if (!id || !name || !type) {
    return res
      .status(400)
      .json({ error: "Missing required fields: id, name, type" });
  }

  try {
    // Parse the JSON string from the request body
    const result = await deployWorkflow(id, name, type);
    return res.status(200).json({
      status: "success",
      uuid: result.uuid,
    });
  } catch (err) {
    console.error("❌ Deployment failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  deployWorkflowHandler,
};

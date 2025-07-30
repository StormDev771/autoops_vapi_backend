// controllers/deployController.js
const { deployWorkflow } = require("../services/n8n_deployService");

const deployWorkflowHandler = async (req, res) => {
  const { workflowname } = req.body;

  if (!workflowname) {
    return res
      .status(400)
      .json({ error: "workflowname is required in request body" });
  }

  try {
    // Parse the JSON string from the request body
    const result = await deployWorkflow(workflowname);
    return res.status(200).json({
      status: "success",
      action: result.action,
      workflow: result.workflow,
    });
  } catch (err) {
    console.error("❌ Deployment failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  deployWorkflowHandler,
};

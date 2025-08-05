// services/deployService.js
require("dotenv").config();
const axios = require("axios");
const {
  getVehicleByPhone,
  suggestApptSlots,
  bookAppt,
} = require("../n8n_workflow/n8n_templete_workflow");

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

const headers = {
  "X-N8N-API-KEY": `${N8N_API_KEY}`,
  "Content-Type": "application/json",
};

const deployWorkflow = async (id, name, type) => {
  let res;
  let uuid;

  switch (type) {
    case "getVehicleByPhone":
      const result = getVehicleByPhone(id, name);
      res = await axios.post(
        `${N8N_API_URL}api/v1/workflows`,
        result.workflow,
        {
          headers,
        }
      );
      uuid = result.uuid;
      break;
    case "suggestApptSlots":
      const result1 = suggestApptSlots(id, name);
      res = await axios.post(
        `${N8N_API_URL}api/v1/workflows`,
        result1.workflow,
        {
          headers,
        }
      );
      uuid = result1.uuid;
      break;
    case "bookAppt":
      const result2 = bookAppt(id, name);
      res = await axios.post(
        `${N8N_API_URL}api/v1/workflows`,
        result2.workflow,
        {
          headers,
        }
      );
      uuid = result2.uuid;
      break;
    default:
      throw new Error(`Unknown workflow name: ${workflowname}`);
  }

  return { action: "created", workflow: res.data, uuid: uuid };
};

module.exports = { deployWorkflow };

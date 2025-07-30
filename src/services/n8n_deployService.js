// services/deployService.js
require("dotenv").config();
const axios = require("axios");
const {
  GET_VEHICLE_BY_PHONE,
  SUGGEST_APPT_SLOTS,
  BOOK_APPT,
} = require("../n8n_workflow/n8n_templete_workflow");

const N8N_API_URL = process.env.N8N_API_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

const headers = {
  "X-N8N-API-KEY": `${N8N_API_KEY}`,
  "Content-Type": "application/json",
};

const deployWorkflow = async (workflowname) => {
  let res;

  switch (workflowname) {
    case "getVehicleByPhone":
      res = await axios.post(
        `${N8N_API_URL}api/v1/workflows`,
        GET_VEHICLE_BY_PHONE,
        {
          headers,
        }
      );
      break;
    case "suggestApptSlots":
      res = await axios.post(
        `${N8N_API_URL}api/v1/workflows`,
        SUGGEST_APPT_SLOTS,
        {
          headers,
        }
      );
      break;
    case "bookAppt":
      res = await axios.post(`${N8N_API_URL}api/v1/workflows`, BOOK_APPT, {
        headers,
      });
      break;
    default:
      throw new Error(`Unknown workflow name: ${workflowname}`);
  }

  return { action: "created", workflow: res.data };
};

module.exports = { deployWorkflow };

// services/vapiService.js
require("dotenv").config();
const axios = require("axios");

const VAPI_BASE_URL = process.env.VAPI_BASE_URL;
const VAPI_API_KEY = process.env.VAPI_API_KEY;

const headers = {
  Authorization: `Bearer ${VAPI_API_KEY}`,
  "Content-Type": "application/json",
};

const createPhoneNumber = async () => {
  const payload = {
    provider: "vapi",
    numberDesiredAreaCode: "616",
  };

  const response = await axios.post(`${VAPI_BASE_URL}/phone-number`, payload, {
    headers,
  });
  return response.data;
};

const assignPhoneNumber = async (agentId, phoneId) => {
  const payload = {
    assistantId: agentId,
  };

  const response = await axios.patch(
    `${VAPI_BASE_URL}/phone-number/${phoneId}`,
    payload,
    { headers }
  );
  return response.data;
};

module.exports = {
  createPhoneNumber,
  assignPhoneNumber,
};

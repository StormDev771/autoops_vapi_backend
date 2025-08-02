// services/vapiService.js
require("dotenv").config();
const axios = require("axios");

const VAPI_BASE_URL = process.env.VAPI_BASE_URL;
const VAPI_API_KEY = process.env.VAPI_API_KEY;

const headers = {
  Authorization: `Bearer ${VAPI_API_KEY}`,
  "Content-Type": "application/json",
};

const toolGetVehicleByPhone = async () => {
  const payload = {
    type: "function",
    function: {
      name: "getVehicleByPhone_test",
      description: "Get vehicle by phone number",
      parameters: {
        type: "object",
        properties: {
          phoneNumber: {
            type: "string",
            description: "Customer's phone number",
          },
        },
        required: ["phoneNumber"],
      },
    },
    server: {
      url: "https://n8n.sknk.us/webhook/fbfa8682-76bf-45c6-b4c0-a18bc54caef0",
    },
  };

  const response = await axios.post(`${VAPI_BASE_URL}/tool`, payload, {
    headers,
  });
  return response.data;
};

const toolSuggestAppointmentSlots = async () => {
  const payload = {
    type: "function",
    function: {
      name: "suggestAppointmentSlots_test",
      description: "Suggest appointment slots.",
      parameters: {
        type: "object",
        properties: {
          serviceName: {
            type: "string",
            description: "Service Name is what the customer requests.",
          },
        },
        required: ["serviceName"],
      },
    },
    server: {
      url: "https://n8n.sknk.us/webhook/fbfa8682-76bf-45c6-b4c0-a18bc54caef0",
    },
  };

  const response = await axios.post(`${VAPI_BASE_URL}/tool`, payload, {
    headers,
  });
  return response.data;
};

const toolBookAppointment = async () => {
  const payload = {
    type: "function",
    function: {
      name: "bookAppointment_test",
      description: "Suggest appointment slots.",
      parameters: {
        type: "object",
        properties: {
          Year: {
            type: "string",
          },
          Make: {
            type: "string",
          },
          Model: {
            type: "string",
          },
          ISSUE: {
            type: "string",
          },
          NOTES: {
            type: "string",
          },
          firstName: {
            type: "string",
          },
          lasttName: {
            type: "string",
          },
          phoneNumber: {
            type: "string",
            description:
              "User's Phone Number. If there is no " +
              " before the number, please insert a " +
              ' at the beginning. For example, if the number is "2556623365", convert it to "+2556623365".',
          },
          serviceName: {
            type: "string",
            description:
              'This is service that user selected. for example "Tire service"',
          },
          bookDateTime: {
            type: "string",
          },
        },
        required: [
          "ISSUE",
          "NOTES",
          "phoneNumber",
          "serviceName",
          "bookDateTime",
        ],
      },
    },
    server: {
      url: "https://n8n.sknk.us/webhook/fbfa8682-76bf-45c6-b4c0-a18bc54caef0",
    },
  };

  const response = await axios.post(`${VAPI_BASE_URL}/tool`, payload, {
    headers,
  });
  return response.data;
};

const assignToolToAgent = async (agentId, toolId) => {
  const payload = {
    model: {
      provider: "openai",
      model: "gpt-4o",
      toolIds: [`${toolId}`],
    },
  };

  const response = await axios.patch(
    `${VAPI_BASE_URL}/assistant/${agentId}`,
    payload,
    {
      headers,
    }
  );
  return response.data;
};

module.exports = {
  toolGetVehicleByPhone,
  toolSuggestAppointmentSlots,
  toolBookAppointment,
  assignToolToAgent,
};

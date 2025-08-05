require("dotenv").config();
const axios = require("axios");

const AUTOOPS_BASE_URL = process.env.AUTOOPS_BASE_URL;
const AUTOOPS_API_KEY = process.env.AUTOOPS_API_KEY;

const headers = {
  Authorization: `Bearer ${AUTOOPS_API_KEY}`,
  "Content-Type": "application/json",
};

const getClients = async () => {
  let res;
  try {
    res = await axios.get(`${AUTOOPS_BASE_URL}/clients`, { headers });
    const clients = res.data.data.map((client) => ({
      id: client.id,
      name: client.name,
    }));
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

module.exports = { getClients };

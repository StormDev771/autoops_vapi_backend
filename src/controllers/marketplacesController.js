const { getClients } = require("../services/getMarketplaces");

const getClientsHandler = async (req, res) => {
  try {
    const clients = await getClients();
    return res.status(200).json({ status: "success", clients });
  } catch (error) {
    console.error("Error fetching clients:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getClientsHandler,
};

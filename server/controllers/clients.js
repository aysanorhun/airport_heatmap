import Client from "../models/Client.js";

// READ
export const getClientsByTime = async (req, res) => {
  try {
    const { windowStart } = req.params;
    const clients = await Client.find({ WINDOW_START: windowStart });

    if (!clients.length) {
      throw new Error("Clients does not exist.");
    }

    res.status(200).json({ clients });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

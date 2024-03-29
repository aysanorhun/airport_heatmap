import Window from "../models/Window.js";

// READ
export const getFirstLastWindow = async (req, res) => {
  try {
    const firstWindow = await Window.find().sort({ WINDOW_START: 1 }).limit(1);
    const lastWindow = await Window.find().sort({ WINDOW_START: -1 }).limit(1);

    if (!firstWindow.length || !lastWindow.length) {
      throw new Error("Windows does not exist.");
    }

    const windows = [firstWindow[0], lastWindow[0]];

    res.status(200).json({ windows });
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
};

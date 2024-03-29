import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  CLIMAC: {
    type: String,
    required: true,
  },
  CLISSID: {
    type: String,
  },
  CLIUSERNAME: {
    type: String,
  },
  FLOOR: {
    type: String,
    required: true,
  },
  WINDOW_START: {
    type: Number,
    required: true,
  },
  CLIAPMAC_COUNT: {
    type: Number,
    required: true,
  },
  POSITION: {
    X: {
      type: Number,
      required: true,
    },
    Y: {
      type: Number,
      required: true,
    },
  },
});

const Client = mongoose.model("Client", userSchema, "climac_positions");
export default Client;

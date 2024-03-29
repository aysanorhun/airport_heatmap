import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  WINDOW_START: {
    type: Number,
    required: true,
  },
  NRUNIQUECLIMAC: {
    type: Number,
  },
  NRCLIMACPOSITION: {
    type: Number,
  },
});

const Window = mongoose.model("Window", userSchema, "climac_position_window");
export default Window;

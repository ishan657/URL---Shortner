const mongoose = require("mongoose");
const shortid = require("shortid");

const urlSchema = new mongoose.Schema({
  Full: {
    type: String,
    required: true,
  },
  Short: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("ShortURL", urlSchema);

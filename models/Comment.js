const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userID: String,
  content: String,
  timeUsec: Number,
  username: String,
  blockage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage',
  }
});

module.exports = mongoose.model('Comment', commentSchema);
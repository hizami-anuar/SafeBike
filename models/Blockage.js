const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const blockageSchema = new mongoose.Schema({
  location: {
    type: pointSchema,
    required: true
  },
  time: Number,
  reporter: String,
  description: String,
  status: String
})

module.exports = mongoose.model('Blockage', blockageSchema);
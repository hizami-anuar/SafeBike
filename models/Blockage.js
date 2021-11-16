const mongoose = require("mongoose");

// THIS COMMENT IS WRONG, update later
/**
 * @typedef Blockage
 * @prop {number[]} location // [longitude, latitude] of location
 * @prop {number} time // current time represented by milliseconds
 * @prop {string} reporter // the username of the reporter
 * @prop {string} description // description of blockage
 * @prop {string} status // status of blockage
 */

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
  reporter: Number,
  description: String,
  status: String
})

module.exports = mongoose.model('Blockage', blockageSchema);
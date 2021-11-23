const mongoose = require("mongoose");

// THIS COMMENT IS likely still WRONG, update later
/**
 * @typedef Blockage
 * @prop {number[]} location // [latitude, longitude] of location
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

const commentSchema = new mongoose.Schema({
  userID: String,
  content: String,
  timeUsec: Number,
  blockage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
  status: String, 
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('Blockage', blockageSchema);
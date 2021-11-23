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

const subscriptionSchema = new mongoose.Schema({
  center: {
    type: pointSchema,
    required: true
  },
  radius: Number,
  user: String,
})

module.exports = mongoose.model('Subscription', subscriptionSchema);
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

const scheduleSchema = new mongoose.Schema({
    days: [Boolean],
    startTime: String,
    endTime: String,
})

const subscriptionSchema = new mongoose.Schema({
  name: String,
  center: {
    type: pointSchema,
    required: true
  },
  radius: Number,
  user: String,
  schedule: scheduleSchema,
})

module.exports = mongoose.model('Subscription', subscriptionSchema);
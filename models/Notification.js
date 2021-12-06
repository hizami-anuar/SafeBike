const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  blockage: { // there's only notifications for blockages right now
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage',
  },
  time: Number, // unix time in ms
  read: Boolean, // whether user has read the notif
})

module.exports = mongoose.model('Notification', notificationSchema);
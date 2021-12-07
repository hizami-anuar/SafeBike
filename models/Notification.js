const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }, // target user
  subscriptions: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  }], // subs that caused this notification-- should be at least one
  blockage: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage',
  }, // there's only notifications for blockages right now
  time: Number, // unix time in ms
  read: Boolean, // whether user has read the notif
})

module.exports = mongoose.model('Notification', notificationSchema);
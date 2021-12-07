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

notificationSchema.methods = { 
  /**
   * converts this document to an object for frontend
   * may populate some stuff
   * 
   * @returns object
   */
  asObject: async function() {
    await this.populate("subscriptions");
    await this.populate("blockage");
    const blockage = await this.blockage.asObject();
    const notif = this.toObject();
    notif.subscriptions = notif.subscriptions.map((s) => {
      return { name: s.name };
    });
    notif.blockage = blockage;
    return notif;
  },
};

module.exports = mongoose.model('Notification', notificationSchema);
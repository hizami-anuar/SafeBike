const mongoose = require("mongoose");

const Subscriptions = require("../models/Subscription");
const Notifications = require("../models/Notification");

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
  reporter: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  status: String,
  active: Boolean,
  voteCount: Number,
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // object ids of users who upvoted
  downvotes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // object ids of users who downvoted
  parentBlockage: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage',
    required: false,
  },
  childBlockage: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage',
    required: false,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
  }],
  reputation: { // progress towards a status update being approved
    type: Number,
    required: false,
  }
})

blockageSchema.methods = {
  calculateReputationAndSave: async function() {
    await this.populate('upvotes');
    await this.populate('downvotes');
    const sumLevel = (users) => users.reduce((sum, user) => sum + user.activityLevel, 0);
    this.reputation = sumLevel(this.upvotes) - sumLevel(this.downvotes);
    await this.save();
  },
  checkReputation: async function() {
    // first recalc the reputation
    await this.calculateReputationAndSave();
    // activates this blockage if enough reputation
    if (this.reputation >= 3) {
      this.active = true;
      await this.save();
      // now deactivate parent
      await this.populate('parentBlockage');
      this.parentBlockage.active = false;
      await this.parentBlockage.save();
    }
    // deletes this blockage if no reputation
    if (this.reputation <= 0) {
      this.remove();
    }
  },
  calculateVotesAndSave: async function() {
    this.voteCount = this.upvotes.length - this.downvotes.length;
    await this.save();
    // now make the reporter recalc their total activity
    await this.populate('reporter');
    if (!this.reporter) return;
    await this.reporter.calculateActivity();
    // if not active yet also check reputation
    if (!this.active) {
      await this.checkReputation();
    }
  },
  /**
   * makes a new notification for every user that should be notified
   */
  notify: async function() {
    let subscriptions = await Subscriptions.find({});
    subscriptions = subscriptions.filter((s) => {
      if (s.isEmpty()) { return false; }
      return s.containsBlockage(this);
    });
    const notifs = {};
    subscriptions.forEach((s) => {
      const time = s.nextNotificationTimeFor(this);
      const key = [s.user._id, time].join(',');
      console.log(key);
      if (notifs[key]) {
        notifs[key].subscriptions.push(s._id);
      } else {
        const notif = {
          user: s.user._id,
          subscriptions: [s._id],
          blockage: this._id,
          time: time,
          read: false,
        };
        notifs[key] = notif;
      }
    });
    let createdNotifs = await Notifications.insertMany(Object.values(notifs));
    console.log(createdNotifs);
    return createdNotifs;
  },
  /**
   * converts this document to an object for frontend
   * may populate some stuff
   * 
   * @param {ObjectId} userId logged-in user id, or undefined
   * @returns object
   */
  asObject: async function(userId) {
    // filter an object to certain properties
    const takeFrom = (obj, names) => {
      const res = {};
      for (const name of names) {
        res[name] = obj[name];
      }
      return res;
    };

    // processing function for both blockage and its child
    const process = async (blockage) => {
      // populate reporter
      await blockage.populate("reporter");
      const reporter = blockage.reporter;
      blockage.reporter = reporter
        ? takeFrom(reporter, ["_id", "username", "activityLevel"])
        : {
            username: "[deleted user]",
          };

      // convert to normal js object (hopefully don't need it as a document)
      blockage = blockage.toObject();

      // replace vote lists with whether they contain logged-in user
      // (always false when not logged in)
      blockage.upvoted = blockage.upvotes.some((user) => user._id == userId);
      blockage.downvoted = blockage.downvotes.some((user) => user._id == userId);
      delete blockage.upvotes;
      delete blockage.downvotes;
      return blockage;
    };

    // populate child blockage
    await this.populate("childBlockage");
    let childBlockage = this.childBlockage;
    if (childBlockage) {
      // process child blockage as well
      childBlockage = await process(childBlockage);

      childBlockage = takeFrom(childBlockage, [
        "_id",
        "time",
        "reporter",
        "status",
        "description",
        "reputation",
        "upvoted",
        "downvoted",
      ]);
    } else {
      childBlockage = undefined;
    }

    const blockage = await process(this); // rest of processing
    blockage.childBlockage = childBlockage;

    return blockage;
  },
}

module.exports = mongoose.model('Blockage', blockageSchema);
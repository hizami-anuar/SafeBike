const mongoose = require("mongoose");

const Subscriptions = require("../models/Subscription");

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
  notify: async function() {

  },
}

module.exports = mongoose.model('Blockage', blockageSchema);
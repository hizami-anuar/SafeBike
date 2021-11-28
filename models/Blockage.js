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
  reporter: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  status: String,
  active: Boolean,
  voteCount: Number,
  upvotes: [String], // object ids of users who upvoted
  downvotes: [String], // object ids of users who downvoted
  parentBlockage: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blockage'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment'
  }]
})

blockageSchema.methods = {
  calculateVoteCount: async function() {
    this.voteCount = this.upvotes.length - this.downvotes.length;
    await this.save();
    await this.populate('reporter');
    console.log(this.reporter);
    await this.reporter.calculateActivity();
  }
}

module.exports = mongoose.model('Blockage', blockageSchema);
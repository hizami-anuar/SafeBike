const mongoose = require("mongoose");

const Blockages = require("../models/Blockage");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  activityScore: Number,
  activityLevel: Number,
})

userSchema.methods = {
  /**
   * current Activity Score formula: sum of upvotes - downvotes per blockage
   * score needed for level n: (n^2)-1
   * * level 1: n/a (users never go below level 1)
   * * level 2: 3
   * * level 3: 8
   * * level 4: 15
   */
  calculateActivity: async function() {
    // const allBlockages = await Blockages.find();
    // allBlockages.map(b => b.populate('reporter'));
    // console.log(allBlockages);
    const blockages = await Blockages.find({ reporter: { _id: this._id } });
    const blockageScores = blockages.map(b => b.voteCount);
    let score = blockageScores.reduce((c, x) => c+x, 0);
    // console.log(this._id, blockages, blockageScores, score);
    this.activityScore = score;
    this.activityLevel = Math.floor(Math.pow(Math.max(1, score+1), 0.5));
    await this.save();
  }
}

module.exports = mongoose.model('User', userSchema);
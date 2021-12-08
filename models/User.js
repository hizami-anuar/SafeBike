const mongoose = require("mongoose");

const Blockages = require("../models/Blockage");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  activityScore: Number,
  activityLevel: Number,
  strikes: Number,
  restricted: Boolean,
})

userSchema.methods = {
  /**
   * recalcs activity score and runs restricted check
   * 
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
    await this.checkRestricted();
  },
  /**
   * checks if user is low enough to be restricted
   * restriction criteria is three bad posts in the last 10
   * where "bad" is -3 or lower and 2/3 downvoted
   */
  checkRestricted: async function() {
    const isBad = (blockage) => {
      const ups = blockage.upvotes.length;
      const downs = blockage.downvotes.length + 1e-9;
      return (ups-downs <= -3) && ((ups / downs) <= 1/2);
    };
    const blockages = await
      Blockages.find({ reporter: { _id: this._id } })
      .sort({ _id: -1 })
      .limit(10); // 10 most recent *by creation time*
    const badBlockages = blockages.filter(b => isBad(b));
    this.strikes = badBlockages.length;
    this.restricted = this.restricted || (this.strikes >= 3);
    await this.save();
  },
}

module.exports = mongoose.model('User', userSchema);
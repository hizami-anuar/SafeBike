const sphericalGeometry = require("spherical-geometry-js");
const computeDistanceBetween = sphericalGeometry.computeDistanceBetween;

const express = require("express");

const Blockages = require("../models/Blockage");
const Users = require("../models/User");
const Subscriptions = require("../models/Subscription");
const Comments = require("../models/Comment");

const validateThat = require("./middleware");
const router = express.Router();

/**
 * List all blockages.
 * Allows query by specific properties of blockage (i.e. reporter).
 *
 * @name GET /api/blockages
 *
 * @return {Blockage[]} - list of blockages
 */
router.get("/", async (req, res) => {
  const getSubscription = req.query.subscription == 'true';
  delete req.query.subscription;
  let blockages = [];
  if (getSubscription && req.session.user) {
    const subscriptions = await Subscriptions.find({ user: req.session.user._id });
    function inCircle(circle, point) {
      let point1 = {lat: circle.center.coordinates[0], lon: circle.center.coordinates[1]};
      let point2 = {lat: point[0], lon: point[1]}
      let distance = computeDistanceBetween(point1, point2);
      return distance <= circle.radius;
    }
    blockages = await Blockages.find(req.query);
    blockages = blockages.filter(blockage => {
      return subscriptions.some((circle) => inCircle(circle, blockage.location.coordinates));
    });
  } else {
    blockages = await Blockages.find(req.query);
  }
  // edit fields of blockage before returning to frontend
  blockages = await Promise.all(blockages.map(async (blockage) => {
    blockage = blockage.toObject(); // hopefully don't need it as a document
    const reporter = await Users.findOne({_id: blockage.reporter});
    blockage.reporter = reporter ? {
      _id: reporter._id,
      username: reporter.username,
      activityLevel: reporter.activityLevel,
    } : {
      username: "[deleted user]",
    };
    
    const userId = req.session.user && req.session.user._id; // id or undefined
    // console.log(userId);
    // console.log(blockage.upvotes, blockage.downvotes)
    blockage.upvoted = blockage.upvotes.includes(userId);
    blockage.downvoted = blockage.downvotes.includes(userId);
    delete blockage.upvotes;
    delete blockage.downvotes;

    return blockage;
  }));
  res.status(200).json({ blockages: blockages }).end();
});

/**
 * Create a blockage.
 *
 * @name POST /api/blockages
 *
 * @param {Object} location - object with latitude/longitude values
 * @param {string} description - description of blockage
 * @param {string} status - status of blockage
 * @param {Boolean} active - whether the blockage is active or not (historical)
 * @param {Blockage} parentBlockage - the blockage that this supercedes, or none
 * @return {Blockage} - the created blockage
 * @throws {403} - if user is not logged in
 */
router.post("/", 
  [
    validateThat.userIsLoggedIn,
  ], 
  async (req, res) => {
    const blockage = {
      location: { 
        type: "Point", 
        coordinates: [req.body.location.latitude, req.body.location.longitude] // coordinates come from body
      },
      time: Date.now(), // uses current time
      reporter: req.session.user._id, // reporter is the user currently logged in
      description: req.body.description, // description comes from body
      status: req.body.status, // status comes from body
      active: req.body.active, // all new blockages should be active
      voteCount: 0,
      upvotes: [],
      downvotes: [],
      parentBlockage: req.body.parentBlockage, // parent blockage comes from body
      comments: []
    };
    // console.log('parent blockage: ', req.body.parentBlockage);
    if (req.body.parentBlockage) {
      await Blockages.findOneAndUpdate({ _id: req.body.parentBlockage }, { active: false });
    }
    
    let createdBlockage = await Blockages.create(blockage);
    res.status(200).json({blockageData: createdBlockage}).end();
  });

/**
 * Update a blockage.
 *
 * @name PATCH /api/blockages/:id
 *
 * @param {Object} location - object with latitude/longitude values
 * @param {string} description - description of blockage
 * @param {string} status - status of blockage
 * @return {Blockage} - the updated blockage
 * @throws {403} - if user is not logged in or does not have permission
 */
router.patch("/:id", 
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.userHasPermission,
  ], 
  async (req, res) => {
    const id = req.params.id;

    // const latitude = req.body.location.latitude;
    // const longitude = req.body.location.longitude;
    const time = Date.now();
    const reporter = req.session.user._id;
    const description = req.body.description;
    const status = req.body.status;
    let location = undefined; 
    if (req.body.location)
      location = { type: "Point", coordinates: [req.body.location.latitude, req.body.location.longitude] };
    const updates = {
      location: location,
      time: time,
      reporter: reporter,
      description: description,
      status: status,
    };
    Object.keys(updates).forEach((key) =>
      updates[key] === undefined ? delete updates[key] : {}
    );
    const response = await Blockages.findOneAndUpdate({ _id: id }, updates);
    res.status(200).json(response).end();
  });

/**
 * Delete a blockage.
 *
 * @name DELETE /api/blockages/:id
 *
 * @return {Blockage} - the deleted blockage
 * @throws {403} - if user is not logged in or does not have permission
 */
router.delete("/:id", [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.userHasPermission,
  ], 
    async (req, res) => {
    const id = req.params.id;
    const blockage = await Blockages.findOneAndDelete({ _id: id });
    await blockage.populate('reporter');
    await blockage.reporter.calculateActivity();
    res.status(200).json(blockage).end();
  });

/////////// VOTING FUNCTIONS /////////////
/**
 * Upvote a blockage (removing downvote if exists).
 *
 * @name POST /api/blockages/upvote/:id
 *
 * @return {Blockage} - the upvoted blockage
 * @throws {403} - if user is not logged in
 */
router.post("/upvote/:id", [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
  ], async (req, res) => {
    // https://mongoosejs.com/docs/documents.html
    // if concurrency ever an issue, use findOneAndUpdate
    // or wrap a retry loop for VersionError
    const blockage = await Blockages.findOne({_id: req.params.id});
    const userId = req.session.user._id;
    blockage.downvotes.pull(userId);
    if (!blockage.upvotes.includes(userId)) { 
      blockage.upvotes.push(userId); 
    } // else no-op
    await blockage.calculateVotesAndSave(); // includes saving
    res.status(200).json(blockage);
  });

/**
 * Downvote a blockage (removing upvote if exists).
 *
 * @name POST /api/blockages/downvote/:id
 *
 * @return {Blockage} - the downvoted blockage
 * @throws {403} - if user is not logged in
 */
router.post("/downvote/:id", [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
  ], async (req, res) => {
    const blockage = await Blockages.findOne({_id: req.params.id});
    const userId = req.session.user._id;
    blockage.upvotes.pull(userId);
    if (!blockage.downvotes.includes(userId)) { 
      blockage.downvotes.push(userId); 
    } // else no-op
    await blockage.calculateVotesAndSave(); // includes saving
    res.status(200).json(blockage);
  });

/**
 * Remove upvote for a blockage.
 *
 * @name DELETE /api/blockages/upvote/:id
 *
 * @return {Blockage} - the unupvoted blockage
 * @throws {403} - if user is not logged in
 */
router.delete("/upvote/:id", [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
  ], async (req, res) => {
    const blockage = await Blockages.findOne({_id: req.params.id});
    blockage.upvotes.pull(req.session.user._id);
    await blockage.calculateVotesAndSave(); // includes saving
    res.status(200).json(blockage);
  });

/**
 * Remove downvote for a blockage.
 *
 * @name DELETE /api/blockages/downvote/:id
 *
 * @return {Blockage} - the undownvoted blockage
 * @throws {403} - if user is not logged in
 */
router.delete("/downvote/:id", [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
  ], async (req, res) => {
    const blockage = await Blockages.findOne({_id: req.params.id});
    blockage.downvotes.pull(req.session.user._id);
    await blockage.calculateVotesAndSave(); // includes saving
    res.status(200).json(blockage);
  });

/////////// COMMENT FUNCTIONS /////////////
// find all comments of a post with id in param
router.get("/comments/:id", [
  validateThat.blockageExists,
], async (req, res) => {
  const blockage = await Blockages.findOne({_id: req.params.id});
  const comments = [];
  for (const comment_id of blockage.comments) {
    const comment = await Comments.findOne({_id: comment_id});
    comments.push(comment);
  }
  res.status(200).json(comments);
});

// post a new comment under a post with the given id
router.post("/comments/:id", [
  validateThat.userIsLoggedIn, 
  validateThat.blockageExists,
],
  async(req, res) => {
    const comment = {
      userID: req.session.user._id,
      content: req.body.content,
      timeUsec: Date.now(),
      username: req.session.user.username,
      blockage: req.params.id,
    }
    const createdComment = await Comments.create(comment);
    response = await Blockages.findOneAndUpdate({_id: req.params.id}, {"$push": {comments: createdComment}});
    // blockage.comments.push(comment);
    res.status(200).json(response).end();
});

// delete a comment object 
// TODO: user can only delete their own comment middleware
router.delete("/comments/:id", [
  validateThat.userIsLoggedIn,
  validateThat.commentExists,
  validateThat.userHasPermissionComment,
],
  async(req, res) => {
    comment = await Comments.findOne({_id: req.params.id});
    blockage = await Blockages.findOne({_id: comment.blockage});
    let updated_comments = blockage.comments.filter((commentId) => commentId !== req.params.id);
    updated = await Blockages.findOneAndUpdate({_id: comment.blockage}, {comments: updated_comments});
    response = await Comments.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(response).end();
  });

  module.exports = router;
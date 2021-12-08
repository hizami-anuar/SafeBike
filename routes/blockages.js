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
  const getSubscription = req.query.subscription == "true";
  delete req.query.subscription;
  let blockages = await Blockages.find(req.query);

  if (getSubscription && req.session.user) {
    const subscriptions = await Subscriptions.find({
      user: req.session.user._id,
    });
    blockages = blockages.filter((blockage) => {
      return subscriptions.some((s) => s.containsBlockage(blockage));
    });
  }

  // id or undefined
  const userId = req.session.user && req.session.user._id;

  // edit fields of blockage before returning to frontend
  blockages = await Promise.all(
    blockages.map((blockage) => {
      return blockage.asObject(userId);
    })
  );
  res
    .status(200)
    .json({ blockages: blockages })
    .end();
});

/**
 * Returns blockages corresponding to currently active subscriptions
 *
 * @name GET /api/blockages/subscription
 *
 * @return {Blockage[]} - list of blockages
 */
router.get("/subscription", [validateThat.userIsLoggedIn], async (req, res) => {
  let blockages;
  let subscriptions = await Subscriptions.find({ user: req.session.user._id });
  let now = new Date();
  subscriptions = subscriptions.filter((s) => {
    return s.containsTime(now);
  });

  // let oneWeekAgo = new Date();
  // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  // oneWeekAgo = oneWeekAgo.valueOf();
  // req.query.time = { $gte: oneWeekAgo }

  // id or undefined
  const userId = req.session.user && req.session.user._id;
  blockages = await Blockages.find(req.query);
  blockages = await Promise.all(
    blockages.map(async (blockage) => {
      return blockage.asObject(userId);
    })
  );

  subscriptions = subscriptions.map((subscription) => {
    subscription._doc.alerts = {
      UNBLOCKED: [],
      UNSAFE: [],
      BLOCKED: [],
    };

    blockages.forEach((blockage) => {
      if (subscription.containsBlockage(blockage)) {
        subscription._doc.alerts[blockage.status].push(blockage);
      }
    });

    subscription = subscription.toObject();
    return subscription;
  });

  res
    .status(200)
    .json({ alerts: subscriptions })
    .end();
});

/**
 * Create a blockage, or submit a status update request.
 * parentBlockage should be undefined if this is a new blockage.
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
router.post(
  "/",
  [validateThat.userIsLoggedIn, validateThat.statusChangeIfUpdate],
  async (req, res) => {
    let blockage = {
      location: {
        type: "Point",
        coordinates: [req.body.location.latitude, req.body.location.longitude], // coordinates come from body
        name: req.body.location.name,
      },
      time: req.body.time, // uses current time
      reporter: req.session.user._id, // reporter is the user currently logged in
      description: req.body.description, // description comes from body
      status: req.body.status, // status comes from body
      voteCount: 1,
      upvotes: [req.session.user._id],
      downvotes: [],
      comments: [],
    };
    const parentBlockage = req.body.parentBlockage;
    if (parentBlockage) {
      // status update request
      blockage = {
        ...blockage,
        active: false,
        parentBlockage: parentBlockage,
        reputation: req.session.user.activityLevel, // starts with user's level
      };
    } else {
      // new blockage
      blockage = { ...blockage, active: true };
    }
    let createdBlockage = await Blockages.create(blockage);
    if (parentBlockage) {
      await Blockages.findOneAndUpdate(
        { _id: parentBlockage },
        {
          childBlockage: createdBlockage._id,
        }
      );
    }
    await createdBlockage.checkReputation();
    await createdBlockage.notify();
    createdBlockage = await Blockages.findById(createdBlockage._id);
    res
      .status(200)
      .json({ blockageData: createdBlockage })
      .end();
  }
);

/**
 * Update a blockage.
 * TODO: if updating time becomes allowed, remember to notify()
 *
 * @name PATCH /api/blockages/:id
 *
 * @param {Object} location - object with latitude/longitude values
 * @param {string} description - description of blockage
 * @param {string} status - status of blockage
 * @return {Blockage} - the updated blockage
 * @throws {403} - if user is not logged in or does not have permission
 * @throws {404} - if blockage with the given id does not exist
 */
router.patch(
  "/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.userHasPermission,
    validateThat.blockageWithinEditGracePeriod,
  ],
  async (req, res) => {
    const id = req.params.id;

    // const latitude = req.body.location.latitude;
    // const longitude = req.body.location.longitude;
    const reporter = req.session.user._id;
    const description = req.body.description;
    const status = req.body.status;
    let location = undefined;
    if (req.body.location)
      location = {
        type: "Point",
        coordinates: [req.body.location.latitude, req.body.location.longitude],
      };
    const updates = {
      location: location,
      reporter: reporter,
      description: description,
      status: status,
    };
    Object.keys(updates).forEach((key) =>
      updates[key] === undefined ? delete updates[key] : {}
    );
    const response = await Blockages.findOneAndUpdate({ _id: id }, updates);
    res
      .status(200)
      .json(response)
      .end();
  }
);

/**
 * Delete a blockage.
 *
 * @name DELETE /api/blockages/:id
 *
 * @return {Blockage} - the deleted blockage
 * @throws {403} - if user is not logged in or does not have permission
 * @throws {404} - if blockage with the given id does not exist
 */
router.delete(
  "/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.userHasPermission,
    validateThat.blockageWithinEditGracePeriod,
  ],
  async (req, res) => {
    const id = req.params.id;
    const blockage = await Blockages.findOneAndDelete({ _id: id });
    await blockage.populate("reporter");
    await blockage.reporter.calculateActivity();
    await blockage.unnotify();
    res
      .status(200)
      .json(blockage)
      .end();
  }
);

/////////// VOTING FUNCTIONS /////////////
/**
 * Upvote a blockage (removing downvote if exists).
 *
 * @name POST /api/blockages/upvote/:id
 *
 * @return {Blockage} - the upvoted blockage
 * @throws {403} - if user is not logged in
 * @throws {404} - if blockage with the given id does not exist
 */
router.post(
  "/upvote/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.blockageOrParentActive,
  ],
  async (req, res) => {
    // https://mongoosejs.com/docs/documents.html
    // if concurrency ever an issue, use findOneAndUpdate
    // or wrap a retry loop for VersionError
    let blockage = await Blockages.findOne({ _id: req.params.id });
    const userId = req.session.user._id;
    blockage.downvotes.pull(userId);
    if (!blockage.upvotes.includes(userId)) {
      blockage.upvotes.push(userId);
    } // else no-op
    await blockage.calculateVotesAndSave(); // includes saving
    blockage = await Blockages.findById(blockage._id);
    res.status(200).json(blockage);
  }
);

/**
 * Downvote a blockage (removing upvote if exists).
 *
 * @name POST /api/blockages/downvote/:id
 *
 * @return {Blockage} - the downvoted blockage
 * @throws {403} - if user is not logged in
 * @throws {404} - if blockage with the given id does not exist
 */
router.post(
  "/downvote/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.blockageOrParentActive,
  ],
  async (req, res) => {
    let blockage = await Blockages.findOne({ _id: req.params.id });
    const userId = req.session.user._id;
    blockage.upvotes.pull(userId);
    if (!blockage.downvotes.includes(userId)) {
      blockage.downvotes.push(userId);
    } // else no-op
    await blockage.calculateVotesAndSave(); // includes saving
    blockage = await Blockages.findById(blockage._id);
    res.status(200).json(blockage);
  }
);

/**
 * Remove upvote for a blockage.
 *
 * @name DELETE /api/blockages/upvote/:id
 *
 * @return {Blockage} - the unupvoted blockage
 * @throws {403} - if user is not logged in
 * @throws {404} - if blockage with the given id does not exist
 */
router.delete(
  "/upvote/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.blockageOrParentActive,
  ],
  async (req, res) => {
    let blockage = await Blockages.findOne({ _id: req.params.id });
    blockage.upvotes.pull(req.session.user._id);
    await blockage.calculateVotesAndSave(); // includes saving
    blockage = await Blockages.findById(blockage._id);
    res.status(200).json(blockage);
  }
);

/**
 * Remove downvote for a blockage.
 *
 * @name DELETE /api/blockages/downvote/:id
 *
 * @return {Blockage} - the undownvoted blockage
 * @throws {403} - if user is not logged in
 * @throws {404} - if blockage with the given id does not exist
 */
router.delete(
  "/downvote/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.blockageExists,
    validateThat.blockageOrParentActive,
  ],
  async (req, res) => {
    let blockage = await Blockages.findOne({ _id: req.params.id });
    blockage.downvotes.pull(req.session.user._id);
    await blockage.calculateVotesAndSave(); // includes saving
    blockage = await Blockages.findById(blockage._id);
    res.status(200).json(blockage);
  }
);

/////////// COMMENT FUNCTIONS /////////////
/**
 * Get all the comments under a post with the specified id.
 *
 * @name GET /api/blockages/comments/:id
 * @param {string} id - the id of the blockage to get the comments from
 * @return {Comment[]} - list of blockages
 * @throws {404} - if the specified blockage does not exist.
 */
router.get("/comments/:id", [validateThat.blockageExists], async (req, res) => {
  const blockage = await Blockages.findOne({ _id: req.params.id });
  const comments = [];
  for (const comment_id of blockage.comments) {
    const comment = await Comments.findOne({ _id: comment_id });
    comments.push(comment);
  }
  res.status(200).json(comments);
});

/**
 * Post a new comment under the post with the specified id.
 *
 * @name POST /api/blockages/comments/:id
 *
 * @param {string} id - id of the blockage item the user is commenting on
 * @return {Blockage} - the updated blockage item that the comment belongs to
 * @throws {403} - if user is not logged in
 * @throws {404} - if the blockage object doesn't exist
 */
router.post(
  "/comments/:id",
  [validateThat.userIsLoggedIn, validateThat.blockageExists],
  async (req, res) => {
    const comment = {
      userID: req.session.user._id,
      content: req.body.content,
      timeUsec: Date.now(),
      username: req.session.user.username,
      blockage: req.params.id,
    };
    const createdComment = await Comments.create(comment);
    response = await Blockages.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: createdComment } }
    );
    // blockage.comments.push(comment);
    res
      .status(200)
      .json(response)
      .end();
  }
);

/**
 * Delete a comment object.
 *
 * @name DELETE /api/blockages/comments/:id
 *
 * @param {string} id - the id of the comment to delete.
 * @return {Comment} - the deleted comment
 * @throws {403} - if user is not logged in or does not have permission (user deleting someone else's comment)
 * @throws {404} - if the Comment doesn't exist.
 */
router.delete(
  "/comments/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.commentExists,
    validateThat.userHasPermissionComment,
  ],
  async (req, res) => {
    comment = await Comments.findOne({ _id: req.params.id });
    blockage = await Blockages.findOne({ _id: comment.blockage });
    let updated_comments = blockage.comments.filter(
      (commentId) => commentId !== req.params.id
    );
    updated = await Blockages.findOneAndUpdate(
      { _id: comment.blockage },
      { comments: updated_comments }
    );
    comment = await Comments.findOneAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json(comment)
      .end();
  }
);

module.exports = router;

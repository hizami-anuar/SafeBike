const express = require("express");

const Blockages = require("../models/Blockage");
const Users = require("../models/User");
const Subscription = require("../models/Subscription");

const validateThat = require("./middleware");

const router = express.Router();

subscriptions = [];

/**
 * List all blockages.
 * Allows query by specific properties of blockage (i.e. reporter).
 *
 * @name GET /api/blockages
 *
 * @return {Blockage[]} - list of blockages
 */
router.get("/", async (req, res) => {
  const query = req.query;
  let blockages = [];
  if (query.subscription == 'true') {
    const square = (x) => x*x;
    function inCircle(circle, point) {
      let xSquared = square(circle.center[0]-point[0]);
      let ySquared = square(circle.center[1]-point[1]);
      let rSquared = square(circle.radius/111111); // convert meters to degrees
      return xSquared + ySquared <= rSquared
    }
    blockages = await Blockages.find();
    blockages = blockages.filter(blockage => {
      return subscriptions.some((circle) => inCircle(circle, blockage.location.coordinates));
    });
  } else {
    delete query.subscription;
    blockages = await Blockages.find(query);
  }
  await Promise.all(blockages.map(async (blockage) => {
    const user = await Users.findOne({_id: blockage.reporter});
    blockage._doc.reporterUsername = user ? user.username : "[deleted user]";
  }));
  res.status(200).json({ blockages: blockages }).end();
});

/**
 * Get a subscription
 */
router.get("/subscription", 
async (req, res) => {
  res.status(200).json({ subscription: subscriptions }).end();
});

/**
 * Create a subscription.
 */
router.post("/subscription", 
  async (req, res) => {
    subscriptions.push(req.body);
    res.status(200).json({ subscription: subscriptions }).end();
  });

/**
 * Update a subscription's radius.
 */
router.patch("/subscription/:id", 
  async (req, res) => {
    subscriptions.filter(subscription => subscription._id == req.params.id)[0].radius = req.body.radius;
    res.status(200).json(subscriptions).end();
  });

/**
 * Update a subscription's center.
 */
router.patch("/subscription/:id/center", 
  async (req, res) => {
    subscriptions.filter(subscription => subscription._id == req.params.id)[0].center = req.body.center;
    res.status(200).json(subscriptions).end();
  });

/**
 * Delete a subscription.
 */
router.delete("/subscription/:id", 
  async (req, res) => {
    subscriptions = subscriptions.filter(subscription => subscription._id != req.params.id);
    res.status(200).json(subscriptions).end();
  });

/**
 * Create a blockage.
 *
 * @name POST /api/blockages
 *
 * @param {Object} location - object with latitude/longitude values
 * @param {string} description - description of blockage
 * @param {string} status - status of blockage
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
      reporter: req.session.userID, // reporter is the user currently logged in
      description: req.body.description, // description comes from body
      status: req.body.status, // status comes from body
    };
    await Blockages.create(blockage);
    res.status(200).json(blockage).end();
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
    validateThat.userHasPermission,
  ], 
  async (req, res) => {
    const id = req.params.id;

    const latitude = req.body.location.latitude;
    const longitude = req.body.location.longitude;
    const time = Date.now();
    const reporter = req.session.userID;
    const description = req.body.description;
    const status = req.body.status;
    const location = { type: "Point", coordinates: [latitude, longitude] };
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
    response = await Blockages.findOneAndUpdate({ _id: id }, updates);
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
    validateThat.userHasPermission,
  ], 
    async (req, res) => {
    const id = req.params.id;
    blockage = await Blockages.findOneAndDelete({ _id: id });
    res.status(200).json(blockage).end();
  });

module.exports = router;

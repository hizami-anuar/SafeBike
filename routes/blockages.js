const express = require("express");

const Blockages = require("../models/Blockage");
const Users = require("../models/User");
const Subscriptions = require("../models/Subscription");

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
  const subscriptions = await Subscriptions.find();
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
  const subscriptions = await Subscriptions.find({ user: req.session.userID });
  res.status(200).json({ subscription: subscriptions }).end();
});

/**
 * Create a subscription.
 */
router.post("/subscription", 
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const subscription = {
      center: { type: "Point", coordinates: req.body.center },
      radius: req.body.radius,
      user: req.session.userID,
    }
    await Subscriptions.create(subscription);
    res.status(200).json({ subscription: subscription }).end();
  });

/**
 * Update a subscription's radius.
 */
router.patch("/subscription/:id/radius",  
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    response = await Subscriptions.findOneAndUpdate({ _id: req.params.id }, { radius: req.body.radius });
    res.status(200).json(response).end();
  });

/**
 * Update a subscription's center.
 */
router.patch("/subscription/:id/center",  
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const center = { type: "Point", coordinates: req.body.center }
    response = await Subscriptions.findOneAndUpdate({ _id: req.params.id }, { center: center });
    res.status(200).json(response).end();
  });

/**
 * Delete a subscription.
 */
router.delete("/subscription/:id", 
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    response = await Subscriptions.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(response).end();
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

const express = require("express");

const Blockages = require("../models/Blockage");
const Users = require("../models/User");

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
  const query = req.query;
  const blockages = await Blockages.find(query);
  await Promise.all(blockages.map(async (blockage) => {
    const user = await Users.findOne({_id: blockage.reporter});
    blockage._doc.reporterUsername = user ? user.username : "[deleted user]";
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
 * @return {Blockage} - the created blockage
 * @throws {403} - if user is not logged in
 */
router.post("/", 
  [
    validateThat.userIsLoggedIn,
  ], 
  async (req, res) => {
    const latitude = req.body.location.latitude;
    const longitude = req.body.location.longitude;
    const time = Date.now();
    const reporter = req.session.userID;
    const description = req.body.description;
    const status = req.body.status;
    const location = { type: "Point", coordinates: [latitude, longitude] };
    const blockage = {
      location: location,
      time: time,
      reporter: reporter,
      description: description,
      status: status,
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

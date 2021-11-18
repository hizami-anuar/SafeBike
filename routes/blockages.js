const express = require("express");

const Blockages = require("../models/Blockage");
const Users = require("../models/User");

const validateThat = require("./middleware");

const router = express.Router();

/**
 * List all blockages
 *
 * @name GET /api/blockages
 *
 * @return {Blockage[]} - list of blockages
 */
router.get("/", async (req, res) => {
  let query = req.query;
  const blockages = await Blockages.find(query);
  res.status(200).json({ blockages: blockages }).end();
});

/**
 * Create a blockage.
 *
 * @name POST /api/blockages
 *
 * @param {string} content - content of freet
 * @return {Freet} - the created freet
 * @throws {400} - if freet is empty string or longer than 140 chars
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
    res.status(200).json("done").end();
  });

router.patch("/:id", 
  [
    validateThat.userIsLoggedIn,
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  blockage = await Blockages.findOneAndDelete({ _id: id });
  res.status(200).json(blockage).end();
});

module.exports = router;

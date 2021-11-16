const express = require('express');

const Blockages = require('../models/Blockage');
const Users = require('../models/User');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * List all blockages
 * 
 * @name GET /api/blockages
 * 
 * @return {Blockage[]} - list of blockages
 */
router.get('/', 
  async (req, res) => {
  const blockages = await Blockages.find();
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
router.post('/', 
  async (req, res) => {
  console.log(req);
  const latitude = req.body.data.location.latitude;
  const longitude = req.body.data.location.longitude;
  const time = Date.now();
  const reporter = "696969";
  const description = req.body.data.description;
  const status = req.body.data.status;
  const location = { type: 'Point', coordinates: [latitude, longitude] };
  await Blockages.create({
    location: location,
    time: time,
    reporter: reporter,
    description: description,
    status: status,
  });
  res.status(200).json("done").end();
});

router.delete('/:id',
  async (req, res) => {
    const id = req.params.id;
    await Blockages.deleteOne({ _id: id });
    res.status(200).json("deleted").end();
  }
)

module.exports = router;
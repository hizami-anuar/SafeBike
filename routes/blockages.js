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
router.get('/', (req, res) => {
  const blockages = Blockages.getAll();
  res.status(200).json(blockages).end();
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
router.post('/', (req, res) => {
  const location = [69, 420];
  const time = Date.now();
  const reporter = "me";
  const description = "description";
  const status = "status";
  const blockages = Blockages.addOne(location, time, reporter, description, status);
  res.status(200).json(blockages).end();
});

module.exports = router;
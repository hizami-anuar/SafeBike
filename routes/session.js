const express = require('express');

const Users = require('../models/User');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * Set active user in the current session.
 * 
 * @name POST /api/session
 * @return {string} - the username of the user who logged in
 * @throws {403} - if username password combo is not correct
 * @throws {400} - if user is already logged in
 */
router.post('/', [
    validateThat.userIsNotLoggedIn,
    validateThat.validCredentials,
  ], async (req, res) => {
    const user = await Users.findOne({ username: req.body.username });
    delete user.password;
    req.session.user = user;
    res.status(200).json(user);
  });

/**
 * Remove active user object from session.
 * 
 * @name DELETE /api/session
 * @throws 404 if user is not logged in
 */
 router.delete('/', [
    validateThat.userIsLoggedIn,
  ], (req, res) => {
    const user = req.session.user;
    delete req.session.user;
    res.status(200).json(user);
  });

/**
 * Get current active user. If not logged in, a 404 shall be returned.
 *
 * @name GET /api/session
 * @throws 404 if user is not logged in
 */
router.get('/', [
  validateThat.userIsLoggedIn,
  ], async (req, res) => {
    // refresh the user object in case it changed
    const user = await Users.findById(req.session.user._id);
    res.status(200).json(user);
  });


module.exports = router;
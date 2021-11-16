const express = require('express');

const Users = require('../models/User');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * Set username of active user.
 * 
 * @name POST /api/session
 * @return {string} - the username of the user who logged in
 * @throws {403} - if username password combo is not correct
 * @throws {400} - if username or password is not formatted correctly - ie there is whitespace
 */
router.post('/', [
    validateThat.userIsNotLoggedIn,
    validateThat.validUsername,
    validateThat.validPassword,
    validateThat.validCredentials,
  ], (req, res) => {
    const user = Users.findOneUsername(req.body.username);
    req.session.username = req.body.username;
    req.session.userID = user.userID;
    res.status(200).json({ username: req.session.username, userID: user.userID, following: user.following });
  });

/**
 * Remove username of active user.
 * 
 * @name DELETE /api/session
 * @throws 404 if user is not logged in
 */
 router.delete('/', [
    validateThat.userIsLoggedIn,
  ], (req, res) => {
    const username = req.session.username
    req.session.username = undefined;
    req.session.userID = undefined;
    res.status(200).json({ username: username });
  });

/**
 * Get current active user. If not logged in, a 404 shall be returned.
 *
 * @name GET /api/session
 * @throws 404 if user is not logged in
 */
router.get('/', [
  validateThat.userIsLoggedIn,
  ], (req, res) => {
    const user = Users.findOneUserID(req.session.userID);
    res.status(200).json({
        username: req.session.username,
        userID: req.session.userID,
        following: user.following
    });
  });


module.exports = router;
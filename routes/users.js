const express = require('express');

const Users = require('../models/User');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * Get a user by user id.
 * 
 * @name GET /api/users
 * 
 * @param {string} id - userID of user
 * @return {User} - the found User
 * @throws {400} - if the userID is invalid
 */
router.get('/',  
    [
        validateThat.userIDExists,
    ],
    async (req, res) => {
    const id = parseInt(req.query.id, 10);
    const user = await Users.findById(id);
    delete user.password
    res.status(200).json(user).end();
});


/**
 * Create a user.
 * 
 * @name POST /api/users
 * 
 * @param {string} username - name of user
 * @param {string} password - user's password
 * @return {User} - the created User
 * @throws {400} - if username is already taken
 */
 router.post('/', 
 [
 validateThat.usernameDoesNotAlreadyExist, 
 validateThat.validUsername,
 validateThat.validPassword,
 ], 
 async (req, res) => {
 const user = await Users.create({
     username: req.body.username,
     password: req.body.password
 });
 req.session.username = user.username;
 req.session.userID = user._id;
 delete user.password
 res.status(200).json(user).end();
});

/**
 * Update a username.
 * 
 * @name PUT /api/users/:username/edit
 * 
 * @param {string} newUsername - the new username
 * @return {User} - the updated User
 * @throws {403} - if user is not logged in
 * @throws {400} - if username is not formatted correctly - ie there is whitespace or special characters
 */
router.put('/:username?/edit', 
    [
        validateThat.userIsLoggedIn,
        validateThat.validUsername,
        validateThat.usernameDoesNotAlreadyExist,
    ], 
async (req, res) => {
    const username = req.body.username
    const user = await Users.findByIdAndUpdate(req.session.userID, {
        username: req.body.username
    });
    req.session.username = username;
    res.status(200).json(user).end();
});

/**
 * Update a user's password.
 * 
 * @name PUT /api/users/
 * 
 * @param {string} newPassword - the new password
 * @return {User} - the updated User
 * @throws {403} - if user is not logged in
 * @throws {400} - if password is not formatted correctly - ie there is whitespace
 */
 router.put('/',
    [
        validateThat.userIsLoggedIn,
        validateThat.validPassword,
    ], 
async (req, res) => {
    const user = await Users.findByIdAndUpdate(req.session.userID, {
        password: req.body.password
    });
    delete user.password
    res.status(200).json(user).end();
  });

/**
 * Delete a user.
 * 
 * @name DELETE /api/users
 * 
 * @return {User} - the deleted user
 * @throws {404} - if user does not exist
 */
router.delete('/', [
    validateThat.userIsLoggedIn
  ], async (req, res) => {
    const user = await Users.findByIdAndRemove(req.session.userID);
    req.session.username = undefined;
    req.session.userID = undefined;
    res.status(200).json(user).end();
  });


module.exports = router;
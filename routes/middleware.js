const Users = require('../models/User');

// Checks that the username in the request body does not already exist
const usernameDoesNotAlreadyExist = (req, res, next) => {
  if (Users.findOneUsername(req.body.username) !== undefined) {
    res.status(400).json({
      error: `Username ${req.body.username} already exists.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username is formatted properly
//  User is not empty
//  User contains no whitespace
const validUsername = (req, res, next) => {
  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).json({
      error: `username cannot be empty string.`,
    }).end();
    return;
  } else if (/\s/g.test(req.body.username)) {
    res.status(400).json({
      error: `username cannot contain whitespace.`,
    }).end();
    return;
  } else if (req.body.username.length > 15) {
    res.status(400).json({
      error: `username must be 1-15 characters long.`,
    }).end();
    return;
  }
  next();
};

// Checks that the password is formatted properly
//  Password is not empty
//  Password contains no whitespace
const validPassword = (req, res, next) => {
  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).json({
      error: `password cannot be empty string.`,
    }).end();
    return;
  } else if (/\s/g.test(req.body.username)) {
    res.status(400).json({
      error: `password cannot contain whitespace.`,
    }).end();
    return;
  }
  next();
};

// Checks that username/password correspond to a user
const validCredentials = (req, res, next) => {
  const user = Users.findOneUsername(req.body.username);
  if (user === undefined || !(user.password === req.body.password)) {
    res.status(403).json({
      error: `Username password combination not recognized.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username in the parameters exists
const usernameExists = (req, res, next) => {
  if (Users.findOneUsername(req.params.username) === undefined) {
    res.status(404).json({
      error: `Username ${req.params.username} does not exist.`,
    }).end();
    return;
  }
  next()
};

// Checks that the username is set in session, i.e., user logged in
const userIsLoggedIn = (req, res, next) => {
  if (req.session.username == undefined) {
    res.status(403).json({
      error: 'You must be logged in in order to perform this action!'
    }).end();
    return;
  }
  next();
};

// Checks that the user id in query exists
const userIDExists = (req, res, next) => {
  const id = parseInt(req.query.id, 10);
  if (Users.findOneUserID(id) === undefined) {
    res.status(404).json({
      error: `User with ID ${req.query.id} does not exist.`,
    }).end();
    return;
  }
  next();
};

// Checks that the user id to perform following actions with exists
const followingUserIDExists = (req, res, next) => {
  const id = parseInt(req.params.followingUserID, 10);
  if (Users.findOneUserID(id) === undefined) {
    res.status(404).json({
      error: `User with ID ${req.params.followingUserID} does not exist.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username is set in session, i.e., user logged in
const userIsNotLoggedIn = (req, res, next) => {
  if (req.session.username != undefined) {
    res.status(400).json({
      error: 'You are already logged in!'
    }).end();
    return;
  }
  next();
};


module.exports = Object.freeze({
  usernameDoesNotAlreadyExist,
  validUsername,
  validPassword,
  validCredentials,
  usernameExists,
  userIsLoggedIn,
  userIDExists,
  followingUserIDExists,
  userIsNotLoggedIn,
});
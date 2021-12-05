const Users = require('../models/User');
const Blockages = require('../models/Blockage');
const Comments = require('../models/Comment');
const Subscriptions = require('../models/Subscription');

const sendError = (res, status, error) => {
  res.status(status).json({error: error}).end();
}

// Checks that the username in the request body does not already exist
const usernameDoesNotAlreadyExist = async (req, res, next) => {
  let user = await Users.findOne({username: req.body.username});
  if (user != null) {
    return sendError(res, 400, `Username ${req.body.username} already exists.`);
  }
  next();
};

// Checks that the username is formatted properly
//  Username is not empty
//  Username contains no whitespace
//  Username is at most 15 characters
const validUsername = (req, res, next) => {
  if (!req.body.username || req.body.username.length === 0) {
    return sendError(res, 400, `Username cannot be empty string.`);
  } else if (/\s/g.test(req.body.username)) {
    return sendError(res, 400, `Username cannot contain whitespace.`);
  } else if (req.body.username.length > 15) {
    return sendError(res, 400, `Username must be 1-15 characters long.`);
  }
  next();
};

// Checks that the password is formatted properly
//  Password is not empty
//  Password contains no whitespace
const validPassword = (req, res, next) => {
  if (!req.body.password || req.body.password.length === 0) {
    return sendError(res, 400, `Password cannot be empty string.`);
  } else if (/\s/g.test(req.body.username)) {
    return sendError(res, 400, `Password cannot contain whitespace.`);
  }
  next();
};

// Checks that username/password correspond to a user
const validCredentials = async (req, res, next) => {
  const user = await Users.findOne({ username: req.body.username });
  if (user == null || !(user.password === req.body.password)) {
    return sendError(res, 403, `Username/Password combination not recognized.`);
  }
  next();
};

// Checks that the username in the parameters exists
const usernameExists = (req, res, next) => {
  if (Users.findOne({username: req.params.username}) === undefined) {
    return sendError(res, 404, `Username ${req.params.username} does not exist.`);
  }
  next()
};

// Checks that the username is set in session, i.e., user logged in
const userIsLoggedIn = (req, res, next) => {
  if (req.session.user === undefined) {
    return sendError(res, 403, 'You must be logged in in order to perform this action!');
  }
  next();
};

// Checks that the user id in query exists
const userIDExists = (req, res, next) => {
  if (Users.findOne({_id: req.query.id}) === undefined) {
    return sendError(res, 404, `User with ID ${req.query.id} does not exist.`);
  }
  next();
};

// Checks that the user id to perform following actions with exists
const followingUserIDExists = (req, res, next) => {
  if (Users.findOneUserID({ _id: req.params.followingUserID }) === undefined) {
    return sendError(res, 404, `User with ID ${req.params.followingUserID} does not exist.`);
  }
  next();
};

// Checks that the username is set in session, i.e., user logged in
const userIsNotLoggedIn = (req, res, next) => {
  if (req.session.user !== undefined) {
    return sendError(res, 400, 'You are already logged in!');
  }
  next();
};

// Checks that the specified blockage exists.
const blockageExists = async (req, res, next) => {
  const blockage = await Blockages.findOne({ _id: req.params.id });
  if (!blockage) {
    return sendError(res, 404, 'Blockage not found.');
  }
  next();
}

// Checks that the user has permission to edit/delete a blockage
const userHasPermission = async (req, res, next) => {
  const blockage = await Blockages.findOne({ _id: req.params.id });
  if (blockage.reporter != req.session.user._id) {
    return sendError(res, 403, 'You do not have permission to edit or delete this blockage!');
  }
  next()
}

// Checks that the blockage can still be edited or deleted
const blockageWithinEditGracePeriod = async (req, res, next) => {
  const blockage = await Blockages.findOne({ _id: req.params.id });
  console.log(Date.now(), blockage.time)
  if ((Date.now() - blockage.time) > 1800000) {
    return sendError(res, 403, 'You cannot edit blockages that are more than thirty minutes old.');
  }
  next()
}

// Checks that a subscription with given id exists
const subscriptionExists = async (req, res, next) => {
  const subscription = await Subscriptions.findOne({ _id: req.params.id });
  if (!subscription) {
    return sendError(res, 404, 'Subscription not found.');
  }
  next();
}

// Checks that the user has permission to edit/delete a subscription
const userHasPermissionSubscription = async (req, res, next) => {
  const subscription = await Subscriptions.findOne({ _id: req.params.id });
  if (subscription.user != req.session.user._id) {
    return sendError(res, 403, 'You do not have permission to edit or delete this subscription!');
  }
  next()
}

// Checks that the specified comment exists.
const commentExists = async (req, res, next) => {
  const comment = await Comments.findOne({ _id: req.params.id });
  if (!comment) {
    return sendError(res, 404, 'Comment not found.');
  }
  next();
}

// Checks that the user has permission to edit/delete a blockage
const userHasPermissionComment = async (req, res, next) => {
  const comment = await Comments.findOne({ _id: req.params.id });
  if (comment && comment.userID != req.session.user._id) {
    return sendError(res, 403, 'You do not have permission to edit or delete this comment!');
  }
  next()
}

const hasSubscriptionFields = async (req, res, next) => {
  if (!req.body.name) {
    return sendError(res, 400, 'Subscription is required to have a name.');
  } else if (!req.body.center) {
    return sendError(res, 400, 'Subscription is required to have a location center.');
  } else if (!req.body.radius) {
    return sendError(res, 400, 'Subscription is required to have a location radius.');
  } else if (!req.body.schedule.days) {
    return sendError(res, 400, 'Subscription is required to have scheduled days.');
  } else if (!req.body.schedule.startTime) {
    return sendError(res, 400, 'Subscription is required to have a start time.');
  } else if (!req.body.schedule.endTime) {
    return sendError(res, 400, 'Subscription is required to have a end time.');
  }
  next()
}


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
  blockageExists,
  userHasPermission,
  subscriptionExists,
  userHasPermissionSubscription,
  hasSubscriptionFields,
  commentExists,
  userHasPermissionComment,
  blockageWithinEditGracePeriod
});
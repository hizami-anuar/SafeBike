const express = require("express");

const Subscriptions = require("../models/Subscription");

const validateThat = require("./middleware");
const router = express.Router();

/**
 * Get the current user's subscription
 * 
 * @name GET /api/subscriptions
 * 
 * @return {Subscription[]} - list of user's subscriptions
 * @throws {403} - if user is not logged in
 */
router.get("/",
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const subscriptions = await Subscriptions.find({ user: req.session.user._id });
    res.status(200).json({ subscription: subscriptions }).end();
  });

/**
 * Create a subscription.
 * 
 * @name POST /api/subscriptions
 * 
 * @return {Subscription} - the created subscription
 * @throws {403} - if user is not logged in
 */
router.post("/", 
  [
    validateThat.userIsLoggedIn,
    validateThat.hasSubscriptionFields,
  ],
  async (req, res) => {
    const subscription = {
      name: req.body.name,
      center: req.body.center,
      radius: req.body.radius,
      user: req.session.user._id,
      schedule: req.body.schedule,
    }
    await Subscriptions.create(subscription);
    res.status(200).json({ subscription: subscription }).end();
  });

/**
 * Update a subscription.
 * 
 * @name PATCH /api/subscriptions/:id
 *
 * @return {Subscription} - the updated subscription
 * @throws {403} - if user is not logged in or does not have permission
 * @throws {404} - if no subscription with the given id exists
 */
router.patch("/:id/",  
  [
    validateThat.userIsLoggedIn,
    validateThat.subscriptionExists,
    validateThat.userHasPermissionSubscription,
  ],
  async (req, res) => {
    const updates = req.body;
    response = await Subscriptions.findOneAndUpdate({ _id: req.params.id }, updates);
    res.status(200).json(response).end();
  });

/**
 * Delete a subscription.
 * 
 * @name DELETE /api/subscriptions/:id
 *
 * @return {Subscription} - the deleted subscription
 * @throws {403} - if user is not logged in or does not have permission
 * @throws {404} - if no subscription with the given id exists
 */
router.delete("/:id", 
  [
    validateThat.userIsLoggedIn,
    validateThat.subscriptionExists,
    validateThat.userHasPermissionSubscription,
  ],
  async (req, res) => {
    response = await Subscriptions.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(response).end();
  });

  module.exports = router;
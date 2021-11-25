const express = require("express");

const Subscriptions = require("../models/Subscription");

const validateThat = require("./middleware");
const router = express.Router();

/**
 * Get a subscription
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
 */
router.post("/", 
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const subscription = {
      center: { type: "Point", coordinates: req.body.center },
      radius: req.body.radius,
      user: req.session.user._id,
      schedule: {
          days: ['M'],
          startTime: Date.now(),
          endTime: Date.now() + 1000,
      }
    }
    await Subscriptions.create(subscription);
    res.status(200).json({ subscription: subscription }).end();
  });

/**
 * Update a subscription's radius.
 */
router.patch("/:id/radius",  
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    response = await Subscriptions.findOneAndUpdate({ _id: req.params.id }, { radius: req.body.radius });
    res.status(200).json(response).end();
  });

/**
 * Update a subscription's center.
 */
router.patch("/:id/center",  
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const center = { type: "Point", coordinates: req.body.center }
    response = await Subscriptions.findOneAndUpdate({ _id: req.params.id }, { center: center });
    res.status(200).json(response).end();
  });

/**
 * Delete a subscription.
 */
router.delete("/:id", 
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    response = await Subscriptions.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(response).end();
  });

  module.exports = router;
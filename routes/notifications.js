const express = require("express");

const Notifications = require("../models/Notification");

const validateThat = require("./middleware");
const router = express.Router();

/**
 * Get the current user's notifications
 * 
 * @name GET /api/notifications
 * 
 * @return {Notification[]} - list of user's notifications
 * @throws {403} - if user is not logged in
 */
router.get("/",
  [
    validateThat.userIsLoggedIn,
  ],
  async (req, res) => {
    const notifications = await Notifications.find({ 
      user: req.session.user._id,
      time: { $lt: Date.now() }, // only notifications that already happened
    });
    res.status(200).json({ notification: notifications }).end();
  });

module.exports = router;
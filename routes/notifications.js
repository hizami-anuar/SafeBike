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
    let notifications = await Notifications.find({ 
      user: req.session.user._id,
      time: { $lte: Date.now() }, // only notifications that already happened
    });
    
    // edit fields before returning to frontend
    notifications = await Promise.all(
      notifications.map((notification) => {
        return notification.asObject();
      })
    );

    res.status(200).json({ notifications: notifications }).end();
  });


/**
 * Read the specified notification.
 * 
 * @name GET /api/notifications/read/:id
 * 
 * @return {Notification[]} - list of user's notifications
 * @throws {403} - if user is not logged in
 */
router.get("/read/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.userHasPermissionNotification,
  ],
  async (req, res) => {
    let notif = await Notifications.findById(req.params.id);
    notif.read = true;
    await notif.save();

    res.status(200).json(notif).end();
  });


/**
 * Unread the specified notification.
 * 
 * @name GET /api/notifications/unread/:id
 * 
 * @return {Notification[]} - list of user's notifications
 * @throws {403} - if user is not logged in
 */
router.get("/unread/:id",
  [
    validateThat.userIsLoggedIn,
    validateThat.userHasPermissionNotification,
  ],
  async (req, res) => {
    let notif = await Notifications.findById(req.params.id);
    notif.read = false;
    await notif.save();

    res.status(200).json(notif).end();
  });

module.exports = router;
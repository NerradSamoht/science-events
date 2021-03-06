const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const emailController = require("../controllers/emailController");
const { catchErrors } = require("../handlers/errorHandlers");

// Homepage
router.get("/", catchErrors(eventController.recentlyAddedEvents));

/* ------------------------------------ */
/* Events
/* ------------------------------------ */

// Browse events
router.get("/events/page/:page", catchErrors(eventController.getEvents));

// Search events
router.get(
  "/search",
  catchErrors(eventController.getEventsByOrganisationAndEventName)
);

// Add an event page
router.get("/add", eventController.addEvent);

router.get("/sign-s3", eventController.signS3);

// Create an event
router.post(
  "/add",
  eventController.upload,
  catchErrors(eventController.resize),
  emailController.newEvent,
  catchErrors(eventController.createEvent)
);

// Edit an existing event
router.get("/event/:id/edit", catchErrors(eventController.editEvent));

// Update an existing event
router.post(
  "/add/:id",
  eventController.upload,
  catchErrors(eventController.resize),
  catchErrors(eventController.updateEvent)
);

// Delete an event
router.post("/events/:id/delete", catchErrors(eventController.deleteEvent));

// Single event page
router.get("/event/:slug", catchErrors(eventController.getEventBySlug));

/* ------------------------------------ */
/* Register
/* ------------------------------------ */

// Register Page
router.get("/register", userController.registerForm);

// Register request
router.post(
  "/register",
  userController.validateRegister,
  catchErrors(userController.register),
  catchErrors(emailController.accountVerification)
);

// Verification path
router.get(
  "/account/confirm/:token",
  catchErrors(userController.validateRegistration)
);

// Resend token
router.get(
  "/account/resend/:token",
  catchErrors(userController.resendValidationToken),
  catchErrors(emailController.accountVerification)
);

router.post(
  "/account/resend",
  catchErrors(userController.resendValidationToken),
  catchErrors(emailController.accountVerification)
);

/* ------------------------------------ */
/* Sign in
/* ------------------------------------ */

// Login page
router.get("/login", userController.loginForm);

// Login request
router.post("/login", authController.login);

// router.post(
//   "/login",
//   authController.login2,
//   catchErrors(authController.loginUser)
//   catchErrors(eventController.getEvents)
// );

/* ------------------------------------ */
/* PASSWORD RESET FLOW
/* ------------------------------------ */

// 1. Page to request a password reset
router.get("/account/forgot", authController.getPasswordReset);
// 2. Post request to send reset tokens
router.post("/account/forgot", catchErrors(authController.forgot));
// 3. Page to actually reset password (requires token)
router.get("/account/reset/:token", catchErrors(authController.reset));
// 4. Post request to update passwords
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

/* ------------------------------------ */
/* Privacy Page
/* ------------------------------------ */
router.get("/privacy", eventController.privacyPage);

/* ------------------------------------ */
/* User Pages
/* ------------------------------------ */

// Log out
router.get("/logout", authController.logout);

// Account page
router.get("/account", authController.isLoggedIn, userController.account);

// Update account details
router.post(
  "/account",
  // eventController.upload,
  // catchErrors(eventController.resize),
  catchErrors(userController.updateAccount)
);

// Delete account
router.post("/delete", catchErrors(userController.deleteAccount));

// My Events
router.get("/my-events", catchErrors(userController.getUserEvents));
router.post("/my-events", catchErrors(eventController.addEventBriteEvents));

// Eventbrite delete link
router.post(
  "/delete-eventbrite-link",
  catchErrors(userController.deleteEventbriteLink)
);

/* ------------------------------------ */
/* ACCOUNT PAGES
/* ------------------------------------ */
router.post(
  "/request-eventbrite",
  catchErrors(authController.requestEventbriteLink)
);

/* ------------------------------------ */
/* MAP PAGE
/* ------------------------------------ */

router.get("/map", eventController.mapPage);

/* ------------------------------------ */
/* ADMIN PAGES
/* ------------------------------------ */

// Admin page
router.get(
  "/admin",
  authController.isLoggedIn,
  catchErrors(adminController.confirmEvents)
);

// Admin
router.post(
  "/admin",
  authController.isLoggedIn,
  adminController.updateEventDisplay
  // catchErrors(eventController.confirmEvents)
);

// Delete all pending events
router.post(
  "/admin/delete-all-pending",
  authController.isLoggedIn,
  adminController.deleteAllPendingEvents
);

// Approve guest event
router.post(
  "/admin/approve-guest-events",
  authController.isAdmin,
  catchErrors(adminController.approveGuestEvents)
);

/* ------------------------------------ */
/* EVENTBRITE EVENTS
/* ------------------------------------ */

// Get Eventbrite events
router.post(
  "/admin/get-eventbrite-events",
  authController.isLoggedIn,
  catchErrors(adminController.getEventbriteEvents)
);

// Add to hide event by organisation list
router.post(
  "/admin/add-to-hide-organisation-list",
  catchErrors(adminController.hideOrganisation)
);

// Remove from hide event by organisation list
router.post(
  "/admin/remove-from-hide-organisation-list",
  catchErrors(adminController.removeOrganisation)
);

// Post request to add details to submit form
router.post("/eb/add", catchErrors(eventController.addSingleEventbriteEvent));

// Paginated admin event pages
router.get(
  "/admin/page/:page",
  authController.isLoggedIn,
  catchErrors(adminController.confirmEvents)
);

// Delete all expired events
router.post(
  "/admin/expired-events",
  catchErrors(adminController.deleteExpiredEvents)
);

/* ------------------------------------ */
/* API
/* ------------------------------------ */

router.get("/api/search", catchErrors(eventController.searchEvents));

router.get(
  "/api/search/organisation",
  catchErrors(eventController.searchOrganistaions)
);

router.get("/api/events/near", catchErrors(eventController.mapEvents));

module.exports = router;

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
  .get(userController.renderUserSignup)
  .post(wrapAsync(userController.postSignup));


router.get("/login",userController.renderLoginForm);

router.post("/login", saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect:'/login', 
    failureFlash: true
  }),
  userController.Login
  );

router.get("/logout", userController.Logout);

module.exports = router;
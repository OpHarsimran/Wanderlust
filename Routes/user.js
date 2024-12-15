const express = require('express');
const router = express.Router();
const User = require('../Models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirect } = require('../middleware.js');
const userController = require('../Controllers/users.js')

router.route('/signup')
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));

router.route('/login')
.get(userController.renderlogin)
.post(saveRedirect,passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}),userController.login);

router.get('/logout',userController.logout)

module.exports = router;

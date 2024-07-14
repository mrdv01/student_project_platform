const express = require('express');
const router = express.Router();

const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userController = require('../controllers/users');

router.route('/register')
    .get( userController.renderRegisterForm)
    .post( userController.createUser);

router.route('/login')
    .get( userController.renderLoginForm)
    .post( storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)




router.get('/logout', userController.logoutUser)

module.exports = router;
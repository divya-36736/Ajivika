const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.contoller');
const locationController = require('../controllers/location.controller');
const formController = require('../controllers/form.controller');
const reviewController = require('../controllers/review.controller');

authRouter.post('/register', authController.registerHirerController);

authRouter.post('/login', authController.loginHirerController);

authRouter.get('/logout', authController.logoutHirerController);

authRouter.post('/post-job', locationController.createJobPost);

authRouter.get('/get-locations', locationController.getAllLocations);

authRouter.post('/form-fill', formController.applyForJob);

authRouter.post('/add-review', reviewController.addReview);

// URL mein /:userId add karna zaroori hai
authRouter.get('/get-review/:userId', reviewController.getUserReviews);

module.exports = authRouter;
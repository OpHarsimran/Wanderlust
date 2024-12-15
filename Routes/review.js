const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const Review = require('../Models/review.js');
const {validateReview, isLogged, isReviewAuthor} = require('../middleware.js');

const reviewController = require('../Controllers/reviews.js')

//post review request
router.post('/', isLogged,validateReview, wrapAsync(reviewController.addReview));

//delete review request
router.delete('/:reviewId',isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;

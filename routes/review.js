const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, loggedin, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js");

// post route reviews
router.post("/",loggedin, validateReview, wrapAsync(reviewController.postNewReview));

// delete route review delete
router.delete("/:reviewId", isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
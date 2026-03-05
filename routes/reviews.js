const wrapAsync = require("../utlis/wrapAsync.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewControllers = require("../controllers/reviews.js");

const express = require("express");
const router = express.Router({ mergeParams: true });




//Reviews
//Post review route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewControllers.createReview));

// Delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview));  

module.exports = router;


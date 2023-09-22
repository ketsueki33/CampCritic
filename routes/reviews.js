const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Review = require("../models/review");
const Campground = require("../models/campground");

const reviews = require("../controllers/reviews");

router
    .route("/")
    .get(reviews.reviewRedirect)
    .post(validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;

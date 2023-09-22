const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Review = require("../models/review");
const Campground = require("../models/campground");

router.get("/", (req, res) => {
    const { id } = req.params;
    res.redirect(`/campgrounds/${id}`);
});

router.post(
    "/",
    validateReview,
    isLoggedIn,
    catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", "Your review has been added!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    catchAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted!");
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Campground = require("../models/campground");
const { reviewSchema } = require("../utils/schemas");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((er) => er.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post(
    "/",
    validateReview,
    catchAsync(async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success","Your review has been added!")
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:reviewId",
    catchAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted!")
        res.redirect(`/campgrounds/${id}`);
    })
);

module.exports = router;

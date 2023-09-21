const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn } = require("../middleware");
const { campgroundSchema } = require("../utils/schemas");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((er) => er.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get(
    "/",
    catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash("success", "Your campground has been added!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate("reviews");
        if (!campground) {
            req.flash("error", "That campground doesn't exist :(");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash("error", "That campground doesn't exist :(");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash("success", "Your campground has been updated!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Campground deleted!");
        res.redirect("/campgrounds");
    })
);

module.exports = router;

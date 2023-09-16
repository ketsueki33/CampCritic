// import { setCampModel } from "./models/campground.js";
// const Campground = setCampModel();
// code modified here, models/campground.js and boilerplate.ejs for changing to module type

// import { fileURLToPath } from "url"; // to add __dirname to module type
// const __filename = fileURLToPath(import.meta.url); // to add __dirname to module type
// const __dirname = path.dirname(__filename); // to add __dirname to module type

// import express from "express";
// import mongoose from "mongoose";
// import methodOverride from "method-override";
// import ejsMate from "ejs-mate";
// import path from "path";

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const { campgroundSchema } = require("./utils/schemas");

const app = express();

mongoose
    .connect("mongodb://127.0.0.1:27017/camp-critic")
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log("ERROR from DB");
        console.log(err);
    });

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((er) => er.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get("/", (req, res) => {
    res.redirect("/campgrounds");
});

app.get(
    "/campgrounds",
    catchAsync(async (req, res, next) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post(
    "/campgrounds",
    validateCampground,
    catchAsync(async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.get(
    "/campgrounds/:id",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (campground) {
            res.render("campgrounds/show", { campground });
        }
    })
);

app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render("campgrounds/edit", { campground });
    })
);

app.put(
    "/campgrounds/:id",
    validateCampground,
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

app.delete(
    "/campgrounds/:id",
    catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode } = err;
    if (!err.message) err.message = "oops... something went wrong :(";
    if (!err.statusCode) err.statusCode = 500;
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("*** app started on port 3000 ***");
});

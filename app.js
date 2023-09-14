const express = require("express");
// import express from "express";
const mongoose = require("mongoose");
// import mongoose from "mongoose";
const methodOverride = require("method-override");
// import methodOverride from "method-override";
const ejsMate = require("ejs-mate");
// import ejsMate from "ejs-mate";
const path = require("path");
// import path from "path";
const Campground = require("./models/campground");
// import Campground from "/models/campground";

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.send("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (campground) {
        res.render("campgrounds/show", { campground });
    }
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.listen(3000, () => {
    console.log("*** app started on port 3000 ***");
});

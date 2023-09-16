const mongoose = require("mongoose");
// import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
});

module.exports = mongoose.model("Campground", CampgroundSchema);
// export function setCampModel() {
    // return mongoose.model("Campground", CampgroundSchema);
// }

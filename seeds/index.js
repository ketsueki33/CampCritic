const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, descriptions } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
    .connect("mongodb://127.0.0.1:27017/camp-critic")
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log("ERROR from DB");
        console.log(err);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 28; i++) {
        const price = Math.floor(Math.random() * 5000) + 200;
        const camp = new Campground({
            location: `${cities[i].city}, ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/random/900x700/?camping",
            price,
            description: sample(descriptions),
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});

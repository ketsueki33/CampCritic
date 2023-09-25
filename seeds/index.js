const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors, descriptions } = require("./seedHelpers");
const Campground = require("../models/campground");
const Review = require("../models/review");

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
    await Review.deleteMany({});
    for (let i = 0; i < 28; i++) {
        const price = Math.floor(Math.random() * 5000) + 200;
        const camp = new Campground({
            // your author id
            author: "650d43544f62950e49834cb5",
            location: `${cities[i].city}, ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            description: sample(descriptions),
            geometry: { type: "Point", coordinates: [74.131923, 14.812093] },
            images: [
                {
                    url: "https://res.cloudinary.com/dd4zt9qj1/image/upload/v1695491860/CampCritic/we3yj1w8rfewcpcfew8n.jpg",
                    filename: "CampCritic/we3yj1w8rfewcpcfew8n",
                },
                {
                    url: "https://res.cloudinary.com/dd4zt9qj1/image/upload/v1695491861/CampCritic/rridqnyspmaf9abnw2gs.jpg",
                    filename: "CampCritic/rridqnyspmaf9abnw2gs",
                },
            ],
        });
        await camp.save();
    }
    const price = Math.floor(Math.random() * 5000) + 200;
    const camp = new Campground({
        // your author id
        author: "650d43544f62950e49834cb5",
        location: "Chandigarh, Chandigarh",
        title: "Saksham's Haven",
        geometry: { type: "Point", coordinates: [74.131923, 14.812093] },
        images: [
            {
                url: "https://thumbs.dreamstime.com/b/alpaca-funny-hair-stands-out-blue-sky-background-detailed-headshot-which-allows-you-to-clearly-54343701.jpg",
                filename: "SakshamsHaven",
            },
        ],
        price,
        description: "Aao kabhi haveli me...",
    });
    await camp.save();
};

seedDB().then(() => {
    console.log("campgrounds seeded successfully");
    console.log("all reviews removed");
    mongoose.connection.close();
});

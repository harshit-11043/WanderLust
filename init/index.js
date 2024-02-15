const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing= require("../models/listing.js");

const MongoURL="mongodb://127.0.0.1:27017/wanderLustproj";
async function main()
{
    await mongoose.connect(MongoURL)
}

main().then(()=>
{
    console.log("Connected to DB");
}).catch((err) =>
{
    console.log(err);
})

const initDB= async()=>
{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");

};

initDB();
const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing= require("../models/listing.js");

// const MongoURL="mongodb://127.0.0.1:27017/wanderLustproj";
const dburl=process.env.ATLASDB_URL;
async function main()
{
    await mongoose.connect(dburl)
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
    initdata.data= initdata.data.map((obj)=>({...obj,owner: "65d76d7770dd269b26d29415"}));
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");

};

initDB();
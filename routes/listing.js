const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const{ListingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>
{
     let {error}=ListingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}
// Index Route
router.get("/", wrapAsync(async(req,res)=>
{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
// New Route
router.get("/new",(req,res)=>
{
    res.render("listings/new.ejs");
});
// Create Route
router.post("/", validateListing,wrapAsync(async(req,res,next)=>
{
    const newone=new Listing(req.body.Listing);
    await newone.save();
    res.redirect("/listings");
}));
// Show Route
router.get("/:id",wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res .render("listings/show.ejs",{listing});
}));
// Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("Listings/edit.ejs",{listing});
}));
// Update Route
router.put("/:id", validateListing,wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings");
}));
// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
      
        console.log(deletedList);
        res.redirect("/listings");
}));

module.exports=router;
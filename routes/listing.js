const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");


// Index Route
router.get("/", wrapAsync(async(req,res)=>
{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
// New Route
router.get("/new", isLoggedIn,(req,res)=>
{
    res.render("listings/new.ejs");
});
// Create Route
router.post("/", isLoggedIn, validateListing,wrapAsync(async(req,res,next)=>
{
    const newone=new Listing(req.body.Listing);
    newone.owner=req.user._id;
    await newone.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));
// Show Route
router.get("/:id",wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing)
    {
        req.flash("error","Listing doesn't exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res .render("listings/show.ejs",{listing});
}));
// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("Listings/edit.ejs",{listing});
}));
// Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing,wrapAsync(async(req,res)=>
{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success","Listing updated!!");
    res.redirect("/listings");
}));
// Delete Route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
      
        console.log(deletedList);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
}));

module.exports=router;
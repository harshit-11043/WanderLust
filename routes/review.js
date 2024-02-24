const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");



// Reviews
// Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>
{
    
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success"," New Review  Created!");
    res.redirect(`/listings/${listing._id}`);
}));
// Review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(async(req,res)=>
{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, { $pull:{reviews:reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review  Deleted!");
    res.redirect("/listings");
})
);
module.exports=router;
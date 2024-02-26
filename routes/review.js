const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const reviewController=require("../controllers/reviews.js");

// Reviews
// Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
// Review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;
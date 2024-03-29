const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const{ListingSchema}=require("./schema.js");
const{reviewSchema}=require("./schema.js");
const review = require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!!")
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        // Handle case where listing is not found
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner._id.equals(res.locals.curruser._id)) {
        req.flash("error", "You don't have the permission to edit");
        return res.redirect("/listings");
    }
    next();
}

module.exports.validateListing=(req,res,next)=>
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
};
module.exports.validateReview=(req,res,next)=>
{
     let {error}=reviewSchema.validate(req.body);
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
module.exports.isReviewAuthor=async(req,res,next)=>
{
    let {reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curruser._id))
    {
        req.flash("error","You don't have the permission to delete");
        return res.redirect("/listings");
    }
    next();
}
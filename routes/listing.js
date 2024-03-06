const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("Listing[image]"), validateListing,wrapAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn,listingController.renderNewform);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("Listing[image]"), validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));
// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;
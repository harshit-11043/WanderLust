const Listing=require("../models/listing")



module.exports.index=async(req,res)=>
{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewform=(req,res)=>
{
    res.render("listings/new.ejs");
};
module.exports.createListing=async(req,res,next)=>
{
    const newone=new Listing(req.body.Listing);
    newone.owner=req.user._id;
    await newone.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.showListing=async(req,res)=>
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
};

module.exports.editListing=async(req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing)
    {
        req.flash("error","Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("Listings/edit.ejs",{listing});
};

module.exports.updateListing=async(req,res)=>
{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success","Listing updated!!");
    res.redirect("/listings");
};

module.exports.deleteListing=async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
      
        console.log(deletedList);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
};
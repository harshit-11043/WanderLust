const Listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
module.exports.index=async(req,res)=>
{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewform=(req,res)=>
{
    res.render("listings/new.ejs");
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
    res .render("listings/show.ejs",{listing});
};
module.exports.createListing=async(req,res,next)=>
{

  let response= await geocodingClient.forwardGeocode({
  query: req.body.Listing.location,
  limit:1,
})
  .send();
  
    let url=req.file.path;
    let filename=req.file.filename;
    const newone=new Listing(req.body.Listing);
    newone.owner=req.user._id;
    newone.image={url,filename};
    newone.geometry=response.body.features[0].geometry
    let savedlisting=await newone.save();
    console.log(savedlisting);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
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

    let OriginalImage= listing.image.url;
    OriginalImage=OriginalImage.replace("/upload","/upload/h_300,w_250")
    res.render("Listings/edit.ejs",{listing,OriginalImage});
};

module.exports.updateListing=async(req,res)=>
{
    
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file!="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
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
const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js");
const ListingSchema= new Schema(
    {
        title:
        {
            type:String,
            required:true,
        },
        description:String,
        image:
        {
            type:String,
            default:
            "https://www.pexels.com/photo/green-trees-under-blue-and-orange-sky-during-sunset-1107717/",
            set:(v)=> v===""
            ?"https://www.pexels.com/photo/green-trees-under-blue-and-orange-sky-during-sunset-1107717/"
            :v,

        },
        price:Number,
        location:String,
        country:String,
        reviews: [
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            }
        ]
    });
ListingSchema.post("findOneAndDelete",async(Listing)=>
{
    if(Listing)
    {
        await Review.deleteMany({_id:{$in:Listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;
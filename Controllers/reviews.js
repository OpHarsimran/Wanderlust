const Listing = require('../Models/listing')
const Review = require('../Models/review')

module.exports.addReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','Review created Successfully')

    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findOneAndDelete({ _id: reviewId });
    req.flash('success','Review deleted Successfully')

    res.redirect(`/listings/${id}`);

}
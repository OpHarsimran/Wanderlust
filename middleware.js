const Listing = require('./Models/listing')
const Review = require('./Models/review')
const expressError = require('./utils/expressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');
 
module.exports.isLogged = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.urlRedirect = req.originalUrl;
        req.flash('error','You must be logged in to create a new listing');
        return res.redirect('/login');  
    }
    next();
}

module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.urlRedirect){
        res.locals.urlRedirect = req.session.urlRedirect;
    }else{
        res.locals.urlRedirect = '/listings';
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash('error','You are not the owner of this listing');
            return res.redirect(`/listings/${id}`);
            }
            next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{

    const review = await Review.findById(req.params.reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash('error','You are not the Author of this review');
            return res.redirect(`/listings/${req.params.id}`);
            }
            next();
}

module.exports.validateSchema = (req,res,next) =>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(', ');
        console.log(msg);
        throw new expressError(404,msg)
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(', ');
        console.log(msg);
        throw new expressError(404,msg)
    }else{
        next();
    }
}
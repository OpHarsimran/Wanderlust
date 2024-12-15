const Listing = require('../Models/listing');
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });


module.exports.index = async (req,res)=>{
    const allListing = await Listing.find();
    res.render('listings/index.ejs',{allListing});
}

module.exports.renderNewForm = async (req,res)=>{
    res.render('listings/new.ejs');
}

module.exports.newListing = async (req,res,next)=>{ 
    const newList = req.body.listing;
    const addNew = new Listing(newList);
    let response = await geocodingClient.forwardGeocode({
        query: addNew.location,
        limit:1
    })
    .send();
    

    let url = req.file.path;
    let filename = req.file.filename;
    addNew.owner = req.user._id;
    addNew.image = {url,filename};
    addNew.geometry = response.body.features[0].geometry;
    let savedListing = await addNew.save();
    req.flash('success','New listing created Successfully')
    res.redirect('/listings');
    console.log(savedListing);        

}

module.exports.showListing = async (req,res)=>{
    const listing = await Listing.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash('error','Listing you are for looking does not exist');
        res.redirect('/listings');
    }
    res.render('listings/show',{listing});
}

module.exports.rendereditListing = async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing you are looking for does not exist');
        res.redirect('/listings');
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace('/upload','/upload/w_250')
    res.render('listings/edit.ejs',{listing, originalImage});
}

module.exports.editListing = async (req,res)=>{
    const id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if(typeof req.file !== 'undefined')
    {let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();}    

    req.flash('success','listing updated Successfully')

    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async (req,res)=>{
    const id = req.params.id;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash('success','listing deleted Successfully')

    res.redirect('/listings')
}
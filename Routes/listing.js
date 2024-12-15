const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../Models/listing.js');
const {isLogged,isOwner,validateSchema} = require('../middleware.js');
const listingController = require('../Controllers/listings.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage})


router.route('/')
.get(wrapAsync(listingController.index))
.post(isLogged,upload.single('listing[image]'),validateSchema,wrapAsync(listingController.newListing));


//get new form
router.get('/new',isLogged,listingController.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLogged,isOwner,upload.single('listing[image]'),validateSchema, wrapAsync(listingController.editListing))
.delete(isLogged,isOwner,wrapAsync(listingController.destroyListing));



//edit route
router.get('/:id/edit',isLogged,wrapAsync(listingController.rendereditListing));



module.exports = router;
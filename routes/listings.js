const wrapAsync = require("../utlis/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js"); 
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


const express = require("express");
const router = express.Router();

router.use(express.urlencoded({ extended: true }));


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
    validateListing,
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createlisting)
    );
    

//New Route
router.get("/new", isLoggedIn, listingController.renderNewlistingForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update))
    
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.delete));


    //Edit route
    router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit));



module.exports = router;

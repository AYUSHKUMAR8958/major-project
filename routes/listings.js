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
  // SEARCH ROUTE
router.get("/search", async (req, res) => {

    let { q } = req.query;

    if(!q || q.trim() === ""){
        req.flash("error","Please enter something to search");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        title: { $regex: q, $options: "i" }
    });

    if(listings.length === 0){
        req.flash("error","No listings found for your search");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs",{ allListings: listings });

});

router.get("/suggestions", async (req, res) => {

    let { q } = req.query;

    if(!q){
        return res.json([]);
    }

    const listings = await Listing.find({
        title: { $regex: q, $options: "i" }
    }).limit(5);

    res.json(listings);

});
  

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

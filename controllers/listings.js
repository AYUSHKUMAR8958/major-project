const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    // const allListings = await Listing.find({});
    // res.render("listings/index.ejs", { allListings });
    let {category} = req.query;

    let allListings;

    if(category){
        allListings = await Listing.find({category: category});
    }else{
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs",{allListings});

};

module.exports.renderNewlistingForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });

};


module.exports.createlisting = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};
    
module.exports.edit = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = "";

    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url.replace("/upload", "/upload/w_300");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  // update text fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;
  listing.category = req.body.listing.category;

  // update image only if new file uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");

}
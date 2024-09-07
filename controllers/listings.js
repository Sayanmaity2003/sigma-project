const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings , q : "None"});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req, res)=>{
    let id = req.params.id;
    //populate is used to extract all the datas of reviews and owner
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req, res, next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"...",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});
    //logic to upload the new image
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    //---------------------------
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
    
}

//added feature category
module.exports.filterByCategory = async (req, res, next) => {
    let { q } = req.query;
    console.log(q);
    // console.log(q);
    //It selects documents where the value of the category field is an array that contains all the elements specified in the array [q].
    let allListings = await Listing.find({ category: { $all: [q] } });
    console.log(allListings);
    if (allListings.length != 0) {
      res.locals.success = `Listings Find by ${q}`;
      // const selectedFilter = q;
      res.render("listings/index.ejs", { allListings, q});
    } else {
      req.flash("error", "Listings is not here !!!");
      res.redirect("/listings");
    }
}

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    console.log(req.query.q);
    let input = req.query.q.trim().replace(/\s+/g, " "); // remove start and end space and middle space remove and middle add one space------
    console.log(input);
    if (input == "" || input == " ") {
      //search value empty
      req.flash("error", "No Search Value !");
      res.redirect("/listings");
    }
  
    // convert every word 1st letter capital and other small---------------
    let data = input.split("");
    let element = "";
    let flag = false;
    for (let index = 0; index < data.length; index++) {
      if (index == 0 || flag) {
        element = element + data[index].toUpperCase();
      } else {
        element = element + data[index].toLowerCase();
      }
      flag = data[index] == " ";
    }
    console.log(element);
  
    let allListings = await Listing.find({
      title: element,
    });
    if (allListings.length != 0) {
      res.locals.success = "Search result by Title";
      res.render("listings/index.ejs", { allListings });
      return;
    }
    if (allListings.length == 0) {
      allListings = await Listing.find({
        category: element,
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = `Search results for category"${element}"`;
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      allListings = await Listing.find({
        // country: { $regex: element, $options: "i" },
        country: element,
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = `Search results for country "${element}"`;
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      let allListings = await Listing.find({
        // location: { $regex: element, $options: "i" },
        location: element,
      }).sort({ _id: -1 });
      if (allListings.length != 0) {
        res.locals.success = `Search results for Location "${element}"`;
        res.render("listings/index.ejs", { allListings });
        return;
      }
    }
    if (allListings.length == 0) {
      req.flash("error", "No search results found !!");
      res.redirect("/listings");
    }
  };
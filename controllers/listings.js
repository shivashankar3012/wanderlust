const listings = require("../models/listing");
const opencage = require('opencage-api-client');
const axios = require("axios");
module.exports.index = async (req,res,next)=>{
  const allListings = await listings.find({});
  res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.createNewForm = async (req, res, next) => {
  try{
    let address = req.body.listing.location;
    let map_url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address);
    const response = await axios.get(map_url, {
      headers: {
        'User-Agent': 'Wanderlust/1.0 (nsv.shiva30@gmail.com)' // Replace with your actual app name and email
      }
    });
    const results = response.data;
    // console.log(results);
    // console.log(results[0].lat," ",results[0].lon);
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,filename);
    let lon, lat;
    if (results.length > 0){
      lat = results[0].lat;
      lon = results[0].lon;
    }else{
      lat = 28.6139;
      lon = 77.2088;
    } 
    let newlist = new listings({
      title: req.body.listing.title,
      description: req.body.listing.description,
      image: { url, filename },
      price: req.body.listing.price,
      location: req.body.listing.location,
      country: req.body.listing.country,
      owner: req.user._id,
      reviews: req.body.listing.reviews, // Assuming this is an array of review IDs
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      }
    });

    await newlist.save();
    req.flash("success","New Listing Created!");
    // console.log(newlist);
    res.redirect("/listings");
  }catch (error) {
    console.log('Error:', error);
    req.flash("error", "Error fetching coordinates");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditListing = async (req,res,next)=>{
  try{
    let {id} = req.params;
    let list = await listings.findById(id);
    if(!list){
      req.flash("error","Requested Listing doesnot exist!");
      res.redirect("/listings");
    }
    let originalImgUrl = list.image.url;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{list, originalImgUrl});
  }catch(err){
    next(err);
  }
  // res.send("working");
}

module.exports.renderUpdateListing = async (req,res,next)=>{
  if(!req.body.listing){
    throw new ExpressError(400,"Enter valid data for listing");
  }
  let {id} = req.params;
  let updateList = await listings.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updateList.image = {url, filename};
    await updateList.save();
  }
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
}

module.exports.renderShowListing = async (req,res,next)=>{
  let {id} = req.params;
  let list = await listings.findById(id).populate({
    path: "reviews",
    populate:{path: "author"},
  }).populate("owner");

  if(!list){
    req.flash("error","Requested Listing doesnot exist!");
    res.redirect("/listings");
  }
  // console.log(list);
  res.render("listings/show.ejs", {list, opencage } );
}

module.exports.renderDeleteListing = async (req,res,next)=>{
  let {id} = req.params;
  let deletedList = await listings.findByIdAndDelete(id);
  // console.log(deletedList);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
}
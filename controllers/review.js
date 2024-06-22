const review = require("../models/review.js");
const Listings = require("../models/listing.js");

module.exports.postNewReview = async(req,res) => {
  let listing = await Listings.findById(req.params.id);
  let newreview = new review(req.body.review);
  newreview.author = req.user._id;
  // console.log(newreview);
  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();
  req.flash("success","New Review Created!");
  // console.log("review saved");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res) => {
  let {id, reviewId} = req.params;

  await Listings.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
}
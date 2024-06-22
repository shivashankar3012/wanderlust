const listings = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {schema, reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js");

module.exports.loggedin = (req,res,next)=>{
  // console.log(req.path,"...",req.originalUrl);
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must login to create new listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let listing = await listings.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","Permision Denied!");
    return res.redirect(`/listings/${id}`);  
  }
  next();
}

module.exports.validateListing = (req, res, next)=>{
  const {error} = schema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(404, errMsg);
  }else{
    next();
  }
}

module.exports.validateReview = (req, res, next) =>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(406,errMsg);

  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  // console.log("review author",review.author._id);
  // console.log("currUser",res.locals.currUser._id);
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect(`/login`);
  }
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","Your are not the owner of the Review!");
    return res.redirect(`/listings/${id}`);  
  }
  next();
}
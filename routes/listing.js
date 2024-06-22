const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {loggedin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    loggedin,
    upload.single('listing[image]'), 
    wrapAsync(listingController.createNewForm)
  );
  
// creating new list
router.get("/new",loggedin, listingController.renderNewForm);

router
  .route("/:id")
  .put(
    loggedin, 
    isOwner, 
    upload.single('listing[image]'), 
    validateListing, 
    wrapAsync(listingController.renderUpdateListing)
  )
  .get(wrapAsync(listingController.renderShowListing))
  .delete(loggedin, isOwner, wrapAsync(listingController.renderDeleteListing));

// edit route
router.get("/:id/edit",loggedin, isOwner, listingController.renderEditListing);

// update route

// show route

// delete route

module.exports = router;
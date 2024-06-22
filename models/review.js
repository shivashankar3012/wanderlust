const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = new mongoose.Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createDate:{
    type: Date,
    default: Date.now()
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

module.exports = mongoose.model("Review", reviewSchema);
const mongoose = require("mongoose");
const initData = require("./data.js");
// const listing = require("../models/listing.js");
const listings = require("../models/listing.js");

const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
  console.log("Connected to Database");
}).catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect(mongourl);
}

const initDB = async () =>{
  await listings.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner: '6669f20eb3ee04495ca1d82a'}));
  await listings.insertMany(initData.data);
  console.log("data was initialized");
}
initDB();
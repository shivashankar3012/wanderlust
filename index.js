const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");

// const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

const store =  MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error",()=>{
  console.log("error in mongo session store");
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitalized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 10000,
    maxAge: 7 * 24 * 60 * 60 * 10000,
    httpOnly: true
  },
}


main().then(()=>{
  console.log("Connected to Database");
}).catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect(dbUrl);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log("request user",req.user);
  res.locals.currUser = req.user;
  // console.log(res.locals.currUser);
  next();
});

// app.get("/",(req,res)=>{
//   res.send("server is working");
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(port,()=>{
  console.log(`server is listening on port ${port}`);
});








app.use((err, req, res, next)=>{
  let { status = 505,message = "Something went wrong!" } = err;
  res.render("error.ejs",{err});
});

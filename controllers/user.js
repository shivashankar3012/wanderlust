const User = require("../models/user");
const express = require("express");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const passport = require("passport");

module.exports.renderUserSignup = (req,res)=>{
  res.render("user/signup.ejs");
}

module.exports.postSignup = async(req,res)=>{
  try{
    let{username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to Wanderlust");
      res.redirect("/listings");
    });
  }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm = (req,res)=>{
  res.render("user/login.ejs");
}

module.exports.Login = async (req,res)=>{
  req.flash("success","welcome back to wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  console.log(redirectUrl);
  res.redirect(redirectUrl);
}

module.exports.Logout = (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","You are logged out!");
    res.redirect("/listings");
  });
}
const express = require("express");
const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");

const oauth = asyncHandler(async (req, res) => {
  console.log(req.body);
  if (req.body != {}) {
    try {
      console.log("not empty");
      const { orcid, name, password } = req.body;
      if (!name || !orcid || !password) {
        res.status(401);
        throw new Error("Please enter all the fields");
      }

      const userExists = await User.findOne({ orcid });

      if (userExists) {
        res.status(400);
        throw new Error("User Alredy Exists");
      }

      const user = await User.create({
        name,
        orcid,
        password,
      });
      if(!user){
        res.status(402);
        throw new Error("Internal Server Error");
      }
      res.status(201);
      res.send("User Created Successfully");
    } catch (e) {
      res.status(402).send("Internal Server Error");
    }
  } else {
    res.status(402);
    res.send("Internal Server Error");
  }
});
module.exports = oauth;

const express = require("express");
const User =require("../models/userModel");

const asyncHandler = require("express-async-handler");

const oauth = asyncHandler(async (req, res) => {
    console.log(req.body)
    if(req.body!={}){
        try{
            console.log('not empty')
            const { orcid, name, password } = req.body;
            if (!name || !orcid || !password) {
                res.status(400);
                throw new Error("Please enter all the fields");
            }
    
            const user = await User.create({
                name,
                orcid,
                password,
            });
            console.log(user);
            if(!user){
                console.log("some error");
            }
            res.status(201)
            res.send('User Created Successfully');
        }
        catch(e){
            res.status(400).send('Some Error Orrcured');
        }
    }
    else{
        res.status(400)
        res.send('You can do this')
    }
    
  });
module.exports = oauth;
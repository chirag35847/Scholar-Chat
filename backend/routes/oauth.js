const express = require("express");

const asyncHandler = require("express-async-handler");

const oauth = asyncHandler(async (req, res) => {
    console.log(req.body)
    if(req.body!={}){
        console.log('not empty')
        res.status(200)
        res.send('Go take a beer')
    }
    else{
        res.status(400)
        res.send('You can do this')
    }
    
  });
module.exports = oauth;
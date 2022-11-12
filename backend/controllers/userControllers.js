const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const ENDPOINT = "https://scholar-chat-orcid.herokuapp.com/";

const authUser = asyncHandler(async (req, res) => {
  const { orcid, password } = req.body;

  const user = await User.findOne({ orcid });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      orcid: user.orcid,
      pic: user.pic,
      token: generateToken(user._id),
    });
    res.status(201).send({ message: "You have logged in successfully" });
  } else {
    res.status(401);
    throw new Error("Invalid Orcid or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { orcid: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { authUser, allUsers};

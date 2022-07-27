const User = require("../models/userModel");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const VerifyToken = require("../models/verifyModel");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
// "https://scholar-chat-orcid.herokuapp.com/"
const ENDPOINT = "https://scholar-chat-orcid.herokuapp.com/";
// We need to handle the errors which come in our way, to do this we can use express-async-handler which does this work automatcally
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Alredy Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    const verifyTokenResult = await VerifyToken.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    const url = `${ENDPOINT}api/user/${verifyTokenResult.userId}/verify/${verifyTokenResult.token}`;
    sendMail(user.email, url);
    res.status(201).send({ message: "An email sent to your account" });
  } else {
    res.status(400);
    throw new Error("Failed to create a new User");
  }
});

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
    throw new Error("Invalid Email or Password");
  }
});

const sendMail = asyncHandler(async (recieverMail, url, isRegister, userId) => {
  // console.log("exe");
  try {
    if (isRegister === false) {
      const previousToken = await VerifyToken.findOne({
        userId: userId,
      });

      if (previousToken) {
        await previousToken.remove();
      }

      const verifyTokenResult = await VerifyToken.create({
        userId: userId,
        token: crypto.randomBytes(32).toString("hex"),
      });

      url = `${ENDPOINT}api/user/${verifyTokenResult.userId}/verify/${verifyTokenResult.token}`;
    }

    // console.log("weexe");
    await nodeoutlook.sendEmail({
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      from: process.env.EMAIL,
      to: recieverMail,
      subject: `Please Verify Your Account At ScholarChat`,
      text: `Click this link.\nThis link is only available for 1 hour.\n${url}`,
    });
    // console.log('email sent successfully');
  } catch (error) {
    // console.log('error while sending email');
    console.log(error.message);
    res.status(401).send({ message: "Some error occured" });
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  try {
    console.log("hitting");
    const user = await User.findOne({ _id: req.params.id });
    // console.log(user);
    if (!user) {
      //   res.redirect("http://localhost:3000/");
      return res.status(400).send({ message: "Invalid Link" });
    }

    const verifyToken = await VerifyToken.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!verifyToken) {
      //   res.redirect("http://localhost:3000/");
      return res.status(400).send({ message: "Invalid Link" });
    }
    // console.log(ISODate(verifyToken.expiryDate));

    // if(verifyToken.expiryDate>Date.now()){
    await User.updateOne({ _id: user._id }, { verified: true });
    await verifyToken.remove();

    // res.status(200).send({ message: "Email verified successfully" });
    res.redirect(`${ENDPOINT}verify`);

    // }
    // if(verifyToken.expiryDate<=Date.now()){
    //     await verifyToken.remove();
    //     sendMail(user.email,undefined,false,user._id);
    //     res.status(201).send({message:"The Previous mail was expired, we have sent you another mail"});
    // }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers, verifyUser };

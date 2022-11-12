// One file defining all routes required for getting all users and authentication

const express = require("express");

const {
    authUser,
    allUsers,
  } = require('../controllers/userControllers');
  const { protect } = require("../middlewares/authMiddleware");
  
  const router = express.Router();
  
  router.route("/").get(protect, allUsers);
  router.post("/login", authUser);
  
  module.exports = router;
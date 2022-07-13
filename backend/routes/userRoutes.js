const express = require("express");

const {
    registerUser,
    authUser,
    allUsers,
    verifyUser
  } = require('../controllers/userControllers');
  const { protect } = require("../middlewares/authMiddleware");
  
  const router = express.Router();
  
  router.route("/").get(protect, allUsers);
  router.route("/").post(registerUser);
  router.post("/login", authUser);
  router.route('/:id/verify/:token').get(verifyUser);
  
  module.exports = router;
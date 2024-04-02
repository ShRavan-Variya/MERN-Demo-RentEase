const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user_tbl = require("../models/user_tbl");
const verifyToken = require("../middleware/verifyToken");

//Get all users
router.get("/get_all_user_data", async (req, res) => {
  try {
    const Users_route_tbl = await user_tbl.find();

    const returnData = {
      status: true,
      data: Users_route_tbl,
      message: "List of all users"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

//POST a new user
router.post("/add_user_data", async (req, res) => {

  const incryptedPassword = await bcrypt.hash(req.body.password, 10)

  const user = new user_tbl({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: incryptedPassword,
    user_type: req.body.user_type,
    phone_number: req.body.phone_number,
    address: req.body.address,
  });

  try {
    const newUserTbl = await user.save();

    const token = jwt.sign({ userId: user._id }, 'RentEaseDbData', { expiresIn: '1h' });

    const returnData = {
      status: true,
      data: {
        id: newUserTbl._id,
        firstName: newUserTbl.firstName,
        lastName: newUserTbl.lastName,
        email: newUserTbl.email,
        user_type: newUserTbl.user_type,
        phone_number: newUserTbl.phone_number,
        address: newUserTbl.address,
        token: token,
      },
      message: "Login successfully!"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

//POST for authentication
router.post("/login", async (req, res) => {
  try {
    const user = await user_tbl.findOne({ email: req.body.email });
    if (!user) {
      const returnData = { status: false, data: null, message: "User not found" }
      return res.status(404).json(returnData);
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      const returnData = { status: false, data: null, message: "Invalid password" }
      return res.status(404).json(returnData);
    }

    const token = jwt.sign({ userId: user._id }, 'RentEaseDbData', { expiresIn: '1h' });

    const returnData = {
      status: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user_type: user.user_type,
        phone_number: user.phone_number,
        address: user.address,
        token: token,
      },
      message: "Login successfully!"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

router.get("/get_user_details", verifyToken, async (req, res) => {
  try {
    const user = await user_tbl.findById(req.userId);
    if (!user) {
      const returnData = { status: false, data: null, message: "User not found" }
      return res.status(404).json(returnData);
    }

    const returnData = {
      status: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user_type: user.user_type,
        phone_number: user.phone_number,
        address: user.address,
        token: req.headers.authorization,
      },
      message: "User details get successfully!"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

module.exports = router;

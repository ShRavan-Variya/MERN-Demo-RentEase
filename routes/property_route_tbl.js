const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const property_tbl = require("../models/property_tbl");

//Get all properties
router.get("/get_all_property_data", verifyToken, async (req, res) => {
  try {
    const Property_route_tbl = await property_tbl.find();
    const returnData = {
      status: true,
      data: Property_route_tbl,
      message: "List of all properties"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

//POST a new property
router.post("/add_property_data", verifyToken, async (req, res) => {
  const property = new property_tbl({
    owner_id: req.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone_number: req.body.phone_number,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    availability: req.body.availability,
    home_details: req.body.home_details,
    facilities: req.body.facilities,
    advantages: req.body.advantages,
    near_by: req.body.near_by,
    images: req.body.images
  });

  try {
    const newPropertyTbl = await property.save();
    const returnData = {
      status: true,
      data: {
        property_id:newPropertyTbl._id,
        owner_id:newPropertyTbl.owner_id,
        firstName:newPropertyTbl.firstName,
        lastName:newPropertyTbl.lastName,
        phone_number:newPropertyTbl.phone_number,
        address_line1: newPropertyTbl.address_line1,
        address_line2: newPropertyTbl.address_line2,
        city: newPropertyTbl.city,
        state: newPropertyTbl.state,
        pincode: newPropertyTbl.pincode,
        availability: newPropertyTbl.availability,
        home_details:newPropertyTbl.home_details,
        facilities:newPropertyTbl.facilities,
        advantages:newPropertyTbl.advantages,
        near_by:newPropertyTbl.near_by,
        images:newPropertyTbl.images,
      },
      message: "Add successfully!"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

router.get("/get_property_details", verifyToken, async (req, res) => {
  try {
    const property = await property_tbl.findById(req.query.property_id);
    if (!property) {
      const returnData = { status: false, data: null, message: "Property not found" }
      return res.status(404).json(returnData);
    }

    const returnData = {
      status: true,
      data: {
        property_id:property._id,
        owner_id:property.owner_id,
        firstName:property.firstName,
        lastName:property.lastName,
        phone_number:property.phone_number,
        address_line1: property.address_line1,
        address_line2: property.address_line2,
        city: property.city,
        state: property.state,
        pincode: property.pincode,
        availability: property.availability,
        home_details:property.home_details,
        facilities:property.facilities,
        advantages:property.advantages,
        near_by:property.near_by,
        images:property.images,
      },
      message: "Property details get successfully!"
    }
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    return res.status(500).json(returnData);
  }
});

//Put the properties (#Update)
router.put("/edit_property_data", verifyToken, async (req, res) => {
  const property_id = req.query.property_id;
  const owner_id = req.query.owner_id;
  const updates = req.body; // Data to update

  try {
    const property = await property_tbl.findOne({ _id: property_id, owner_id: owner_id });

    if (!property) {
      const returnData = { status: false, data: null, message: "Property not found" }
      return res.status(404).json(returnData);
    }

    property.firstName = updates.firstName;
    property.lastName = updates.lastName;
    property.phone_number = updates.phone_number;
    property.address_line1 =  updates.address_line1;
    property.address_line2 =  updates.address_line2;
    property.city =  updates.city;
    property.state =  updates.state;
    property.pincode =  updates.pincode;
    property.availability =  updates.availability;
    property.home_details = updates.home_details;
    property.facilities = updates.facilities;
    property.advantages = updates.advantages;
    property.near_by = updates.near_by;
    property.images = updates.images;

    await property.save();
    
    const returnData = {
      status: true,
      data: property,
      message: "Property details updated successfully"
    }
    return res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message }
    res.status(500).json(returnData);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const verifyToken = require("../middleware/verifyToken");
const property_tbl = require("../models/property_tbl");

//Get all properties
router.get("/get_user_property", verifyToken, async (req, res) => {
  try {
    const Property_route_tbl = await property_tbl.find({ isLive: true });
    const returnData = {
      status: true,
      data: Property_route_tbl,
      message: "List of all properties",
    };
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    return res.status(500).json(returnData);
  }
});

router.get("/get_owner_property", verifyToken, async (req, res) => {
  try {
    const Property_route_tbl = await property_tbl.find({ owner_id: req.query.owner_id });
    const returnData = {
      status: true,
      data: Property_route_tbl,
      message: "List of all properties",
    };
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    return res.status(500).json(returnData);
  }
});

//POST a new property
router.post("/add_property_data", verifyToken, async (req, res) => {
  const property = new property_tbl({
    owner_id: req.userId,
    main_image: req.body.main_image,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone_number: req.body.phone_number,
    isLive: req.body.isLive,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    area: req.body.area,
    city: req.body.city,
    state: req.body.state,
    home_details: req.body.home_details,
    facilities: req.body.facilities,
    advantages: req.body.advantages,
    near_by: req.body.near_by,
    images: req.body.images,
  });

  try {
    const newPropertyTbl = await property.save();
    const returnData = {
      status: true,
      data: {
        property_id: newPropertyTbl._id,
        owner_id: newPropertyTbl.owner_id,
        main_image: newPropertyTbl.main_image,
        firstName: newPropertyTbl.firstName,
        lastName: newPropertyTbl.lastName,
        phone_number: newPropertyTbl.phone_number,
        isLive: newPropertyTbl.isLive,
        address_line1: newPropertyTbl.address_line1,
        address_line2: newPropertyTbl.address_line2,
        area: newPropertyTbl.area,
        city: newPropertyTbl.city,
        state: newPropertyTbl.state,
        home_details: newPropertyTbl.home_details,
        facilities: newPropertyTbl.facilities,
        advantages: newPropertyTbl.advantages,
        near_by: newPropertyTbl.near_by,
        images: newPropertyTbl.images,
      },
      message: "Add successfully!",
    };
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    return res.status(500).json(returnData);
  }
});

router.get("/get_property_details", verifyToken, async (req, res) => {
  try {
    const property = await property_tbl.findById(req.query.property_id);
    if (!property) {
      const returnData = {
        status: false,
        data: null,
        message: "Property not found",
      };
      return res.status(400).json(returnData);
    }

    const returnData = {
      status: true,
      data: {
        property_id: property._id,
        owner_id: property.owner_id,
        main_image: property.main_image,
        firstName: property.firstName,
        lastName: property.lastName,
        phone_number: property.phone_number,
        isLive: property.isLive,
        address_line1: property.address_line1,
        address_line2: property.address_line2,
        area: property.area,
        city: property.city,
        state: property.state,
        home_details: property.home_details,
        facilities: property.facilities,
        advantages: property.advantages,
        near_by: property.near_by,
        images: property.images,
      },
      message: "Property details get successfully!",
    };
    res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    return res.status(500).json(returnData);
  }
});

//Put the properties (#Update)
router.put("/edit_property_data", verifyToken, async (req, res) => {
  const property_id = req.query.property_id;
  const owner_id = req.query.owner_id;
  const updates = req.body; // Data to update

  console.log('====================================');
  console.log("property_id::", JSON.stringify(property_id));
  console.log("owner_id::", JSON.stringify(owner_id));
  console.log("updates::", JSON.stringify(updates));
  console.log('====================================');

  try {
    const property = await property_tbl.findOne({
      _id: property_id,
      owner_id: owner_id,
    });

    if (!property) {
      const returnData = {
        status: false,
        data: null,
        message: "Property not found",
      };
      return res.status(400).json(returnData);
    }

    property.main_image = updates.main_image;
    property.firstName = updates.firstName;
    property.lastName = updates.lastName;
    property.phone_number = updates.phone_number;
    property.isLive = updates.isLive;
    property.address_line1 = updates.address_line1,
    property.address_line2 = updates.address_line2,
    property.area = updates.area;
    property.city = updates.city;
    property.state = updates.state;
    property.home_details = updates.home_details;
    property.facilities = updates.facilities;
    property.advantages = updates.advantages;
    property.near_by = updates.near_by;
    property.images = updates.images;

    await property.save();

    const returnData = {
      status: true,
      data: property,
      message: "Property details updated successfully",
    };
    return res.status(200).json(returnData);
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    res.status(500).json(returnData);
  }
});

//POST property images
const uploadDir = path.resolve(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save uploaded files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'RentEaseProperty_' + uniqueSuffix + path.extname(file.originalname)); // Rename files with unique names
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
}).array('images');

// POST endpoint for uploading images
router.post("/upload", verifyToken, async (req, res) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        const returnData = { status: false, data: null, message: err.message };
        return res.status(400).json(returnData);
      } else if (err) {
        const returnData = { status: false, data: null, message: 'Server error' };
        return res.status(500).json(returnData);
      }

      // Files uploaded successfully
      const returnData = {
        status: true,
        data: req.files,
        message: "Image uploaded successfully!",
      };
      return res.status(200).json(returnData);
    });
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    res.status(500).json(returnData);
  }
});

//PUT property images (#update)
router.put("/update", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      const returnData = { status: false, data: null, message: "ID parameter is missing" };
      return res.status(400).json(returnData);
    }
    console.log('====================================');
    console.log("id::",JSON.stringify(id));
    console.log('====================================');

    // Check if the file exists
    const imagePath = path.join(uploadDir, `RentEaseProperty_${id}`);
    if (fs.existsSync(imagePath)) {
      // If image exists, return its URL and a message
      const imageUrl = `/uploads/RentEaseProperty_${id}`;
      const returnData = { status: true, data: { imageUrl }, message: "Image exists, URL returned" };
      return res.status(200).json(returnData);
    }

    // If image doesn't exist, upload the new image
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        const returnData = { status: false, data: null, message: err.message };
        return res.status(400).json(returnData);
      } else if (err) {
        const returnData = { status: false, data: null, message: "Server error" };
        return res.status(500).json(returnData);
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const returnData = { status: true, data: { imageUrl }, message: "Image uploaded successfully" };
      return res.status(200).json(returnData);
    });
  } catch (err) {
    const returnData = { status: false, data: null, message: err.message };
    res.status(500).json(returnData);
  }
});

module.exports = router;

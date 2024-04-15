const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner_id: {type: String, required: true},
  main_image: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  phone_number: {type: Number},
  isLive: {type: Boolean},
  address_line1: {type: String},
  address_line2: {type: String},
  area: {type: String},
  city: {type: String},
  state: {type: String},
  home_details: {type: {
    property_type: {type: String},
    room_type: {type: String},
    rent_amount: {type: Number},
    deposite_amount: {type: Number},
    area_type: {type: String},
    diet_type: {type: String},
    religion: {type: String},
  }, required: true },
  facilities: {type: [String]},
  advantages: {type: [String]},
  near_by: {type: [String]},
  images: {type: [String]}
});

const property_tbl = mongoose.model('property_tbl', propertySchema);

module.exports = property_tbl;

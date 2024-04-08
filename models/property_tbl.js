const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner_id: { type: String, required: true },
  main_image: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true,},
  phone_number: { type: Number, required: true },
  isLive: { type: Boolean, required: true },
  area: { type: String, required: true,},
  city: { type: String, required: true,},
  state: { type: String, required: true,},
  home_details: { type: {
    property_type: { type: String, required: true },
    room_type: { type: String, required: true },
    rent_amount: { type: Number, required: true },
    deposite_amount: { type: Number, required: true },
    area_type: { type: String, required: true },
    diet_type: { type: String, required: true },
    religion: { type: String, required: true },
  }, required: true },
  facilities: { type: [String], required: true }, 
  advantages: { type: [String], required: true },
  near_by: { type: [String], required: true },
  images: { type: [String], required: true },
});

const property_tbl = mongoose.model('property_tbl', propertySchema);

module.exports = property_tbl;

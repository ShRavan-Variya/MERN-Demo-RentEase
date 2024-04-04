const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: { type: Number, required: true },
  phone_number: { type: Number, required: true },
  address_line1: { type: String, required: true,},
  address_line2: { type: String, required: true,},
  city: { type: String, required: true,},
  state: { type: String, required: true,},
  pincode: { type: String, required: true,},
});

const user_tbl = mongoose.model('user_tbl', userSchema);

module.exports = user_tbl;

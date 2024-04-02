const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user_type: { type: Number, required: true },
  phone_number: { type: Number, required: true },
  address: { type: String, required: true },
});

const user_tbl = mongoose.model('user_tbl', userSchema);

module.exports = user_tbl;

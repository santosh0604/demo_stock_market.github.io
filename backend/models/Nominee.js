// models/Nominee.js
const mongoose = require("mongoose");

const nomineeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  number: { type: String, required: true },
  age: { type: Number, required: true }
});

module.exports = mongoose.model("Nominee", nomineeSchema);

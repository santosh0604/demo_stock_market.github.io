// models/User.js
const e = require("connect-flash");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,

  },
  username: {
    type: String,
    required: true,
     unique: true
  },
  phone_no: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: String,
    required: true,
  },
  doid: {
    type: Number,
    require: true,
  },
  income: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'] // restricts to these values
  },
  marital_status: {
    type: String,
    required: true,
    enum: ['Single', 'Married', 'Divorced', 'Widowed']
  },
  profile_photo:{
    type:String,
  },
    // password field removed (handled by passport-local-mongoose)

balance: {
  type: Number,
  default: 100000
},



  // REMOVE this password field (handled by passport-local-mongoose)
  // password: {
  //   type: String,
  //   required: true,
  // },

  ownedStocks: [
    {
      stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
      quantity: { type: Number, default: 0 },
    },
  ],

  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  googleId: { type: String }, // For Google OAuth users
});

// ✅ Use passport-local-mongoose
// userSchema.plugin(passportLocalMongoose, {
//   usernameField: "username" // makes email the login field
// });
userSchema.index({ fullname: 1 }, { unique: false });
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

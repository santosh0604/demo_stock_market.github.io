// // models/User.js
// const e = require("connect-flash");
// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,

//   },
//   username: {
//     type: String,
//     required: true,
//      unique: true
//   },
//   phone_no: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   dob: {
//     type: String,
//     required: true,
//   },
// doid: {
//   type: Number,
//   // remove this field OR make it optional
// },
//   income: {
//     type: Number,
//     required: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ['Male', 'Female', 'Other'] // restricts to these values
//   },
//   marital_status: {
//     type: String,
//     required: true,
//     enum: ['Single', 'Married', 'Divorced', 'Widowed']
//   },
//   profile_photo:{
//     type:String,
//   },
//     // password field removed (handled by passport-local-mongoose)

// balance: {
//   type: Number,
//   default: 100000
// },



//   // REMOVE this password field (handled by passport-local-mongoose)
//   // password: {
//   //   type: String,
//   //   required: true,
//   // },

//   ownedStocks: [
//     {
//       stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
//       quantity: { type: Number, default: 0 },
//     },
//   ],

//   transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
//   googleId: { type: String }, // For Google OAuth users
// });

// // ✅ Use passport-local-mongoose
// // userSchema.plugin(passportLocalMongoose, {
// //   usernameField: "username" // makes email the login field
// // });
// userSchema.index({ fullname: 1 }, { unique: false });
// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);


















// models/User.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ✅ FIX: Removed incorrect `const e = require("connect-flash")` import

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  // passport-local-mongoose uses 'username' as the login field by default
  username: {
    type: String,
    required: true,
    unique: true,
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

  income: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },

  marital_status: {
    type: String,
    required: true,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
  },

  profile_photo: {
    type: String,
  },

  // ✅ Starting balance for virtual stock trading
  balance: {
    type: Number,
    default: 100000,
  },

  // Stocks the user currently holds
  ownedStocks: [
    {
      stock:    { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
      quantity: { type: Number, default: 0 },
    },
  ],

  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],

  // For Google OAuth users
  googleId: { type: String },

  // NOTE: 'password' field is intentionally NOT here —
  // passport-local-mongoose handles hashing & salting automatically
});

// Allow duplicate fullnames (common names like "Santosh")
userSchema.index({ fullname: 1 }, { unique: false });

// ✅ This adds hash, salt, and passport methods (register, authenticate, etc.)
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

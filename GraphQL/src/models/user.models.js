const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [30, 'Name cannot exceed 30 charaters'],
      minLength: [4, 'Name should have more then 4 charaters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [8, 'Password should be greater then 8 charaters'],
    },
    zipcode: {
      type: Number,
    },
    gender: {
      type: String,
      required: [true, 'Please select a gender'],
      enum: ['Male', 'Female', 'Others'],
    },
    country: {
      type: String,
      required: [true, 'Please select a country'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Please enter a Mobile Number'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', userSchema);
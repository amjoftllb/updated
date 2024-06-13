const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [20, "lastName cannot exceed 20 charaters"],
      minLength: [3, "firstName should have more then 3 charaters"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [20, "lastName cannot exceed 20 charaters"],
      minLength: [3, "lastName should have more then 3 charaters"],
    },
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: ["Male", "Female", "Others"],
    },
    birthDate: {
      type: String,
      required: [true, "Please enter a date of birth"],
      validate: {
        validator: function (value) {
          const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-([12][0-9]|0[1-9]|3[01])$/;
          if (!dateRegex.test(value)) {
            return false;
          }
          const parts = value.split("-");
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const day = parseInt(parts[2], 10);
          const date = new Date(year, month - 1, day);
          return (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          );
        },
        message: "Please enter a valid date of birth (YYYY-MM-DD)",
      },
    },
    department: {
      type: String,
      required: [true, "Please select a department"],
      enum: ["Computer-IT", "Mechanical", "Cevil", "Chemical", "Other"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password should be at least 8 characters long"],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            v
          );
        },
        message: (props) =>
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const user = mongoose.model("user", userSchema);
module.exports = user;










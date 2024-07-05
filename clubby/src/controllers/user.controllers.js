const ErrorHandler = require("../utils/ErrorHandler.js");
const User = require("../models/user.models.js");
const OTP = require("../models/otp.model.js");
const otpGenerator = require("otp-generator");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return {
      error: "Something went wrong while generating refresh and access tokens",
    };
  }
};

// controllers
exports.signUp = async (req, res) => {
  try {
    const { email, confirmPassword, password } = req.body;

    if (
      [confirmPassword, email, password].some((field) => field?.trim() === "")
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "User with email already exists" });
    }

    const newUser = await User.create({
      email,
      password,
    });

    const user = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(500)
        .json({ error: "Something went wrong while registering the user" });
    }

    res
      .status(200)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.log(error);
    new ErrorHandler("An error occurred during sign up", 500, res);
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const idToken = token.id_token;

    const result = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googleAuthId = result.payload.sub;
    const email = result.payload.email;
    const existingUser = await User.findOne({ googleAuthId });

    if (!existingUser) {
      const newUser = await User.create({ email , googleAuthId });
      const user = await User.findById(newUser._id).select(
        "-password -refreshToken"
      );
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user._id);
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      const options = {
        httpOnly: true,
        secure: true,
      };
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          message: "User Created and signed in successfully",
          data: loggedInUser,
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      existingUser._id
    );
    const loggedInUser = await User.findById(existingUser._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User signed in successfully", data: loggedInUser });
  } catch (error) {
    new ErrorHandler("An error occurred", 500, res);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({ error: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid user credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User signed in successfully", data: loggedInUser });
  } catch (error) {
    new ErrorHandler("An error occurred during sign in", 500, res);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;

    if (!contact || contact.trim() === "") {
      return res
        .status(400)
        .json({ error: "Email or phone number is required" });
    }

    const user = await User.findOne({
      $or: [{ email: contact }, { phoneNumber: contact }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user?.email === contact) {
      try {
        const email = contact;
        let otp;
        let result;
        do {
          otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          result = await OTP.findOne({ otp });
        } while (result);

        const otpPayload = { email, otp };
        console.log("OTP Body", otpPayload);
        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
          success: true,
          message: `OTP Sent Successfully`,
          otp,
        });
      } catch (error) {
        console.log(error.message);
        return res
          .status(500)
          .json({ error: "something went wrong while Genrating OTP" });
      }
    } else {
    }
  } catch (error) {
    console.log(error);
    new ErrorHandler("An error occurred during OTP generation", 500, res);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
  } catch (error) {
    new ErrorHandler("An error occurred during sign in", 500, res);
  }
};

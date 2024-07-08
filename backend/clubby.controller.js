const ErrorHandler = require("../utils/ErrorHandler.js");
const User = require("../models/user.models.js");
const OTP = require("../models/otp.model.js");
const otpGenerator = require("otp-generator");
const { OAuth2Client } = require("google-auth-library");
const Facebook = require('facebook-node-sdk');
const { appleAuth } = require('apple-auth');

// OAuth 2.0 Configuration-----------------------------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fb = new Facebook({ appId: process.env.FACEBOOK_APP_ID, secret: process.env.FACEBOOK_APP_SECRET });

//Custom Methods----------------------------------- 
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

// controllers-----------------------------------
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
      
      if (!(existingUser.googleAuthId === null)) {
        return res.status(409).json({ error: "You are already registerd with Google Email-id pls sign In with google" })
      }
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
  console.log();
  try {
    const { token } = req.body;
    console.log(token);

    const result = await client.verifyIdToken({
      idToken: token,
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

exports.appleAuth = async (req, res) => {
  try {
    const { idToken, user } = req.body;
    const userInfo = await appleAuth.verifyIdToken(idToken, {
        audience: process.env.APPLE_CLIENT_ID,
        ignoreExpiration: true, 
      });


  
      console.log(userInfo);

  } catch (error) {
    new ErrorHandler("Unable to logout. Server error!", 500, res);
  }
};

exports.facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    fb.api('/me', { access_token: accessToken }, (response) => {
      if (!response || response.error) {
        return res.status(400).json({ error: 'Failed to fetch user details from Facebook.' });
      }
  
      res.json({ message: 'User signed up successfully using Facebook!' });
    });
  
  } catch (error) {
    new ErrorHandler("Unable to logout. Server error!", 500, res);
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
    const { contact, otp } = req.body;

    if (!contact || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({
      $or: [{ email: contact }, { phoneNumber: contact }],
    });

    if (user?.email === contact) {
      const otpRecord = await OTP.findOne({ email: contact, otp });
      if (otpRecord) return res.status(200).json({ message: "OTP verified successfully" });

    } else {

      const otpRecord = await OTP.findOne({ phoneNumber: contact, otp });
      if (otpRecord) return res.status(200).json({ message: "OTP verified successfully" });
    }
    return res.status(400).json({ error: "invalid OTP" });
  } catch (error) {
    new ErrorHandler("An error occurred during sign in", 500, res);
  }
};

exports.logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

    const options = { httpOnly: true, secure: true };

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({message: "User logged out successfully"});
  } catch (error) {
    new ErrorHandler("Unable to logout. Server error!", 500, res);
  }
};























const axios = require("axios");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const serverErrorHandler = require("../utils/serverErrorHandler.js");
const User = require("../models/user.js");
const ChatRoom = require("../models/chatRoom.js");


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

//controllers-----------------------------------
exports.signUp = async (req, res) => {

  try {
    const {
      firstName,
      lastName,
      countryCode,
      phoneNumber,
      confirmPassword,
      password,
    } = req.body;

    if (
      [
        firstName,
        lastName,
        countryCode,
        phoneNumber,
        confirmPassword,
        password,
      ].some((field) => !field?.trim())
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const existingUser = await User.findOne({ phoneNumber: fullPhoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number already registered." });
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({ message: "Avatar is required" });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber: fullPhoneNumber,
      password,
      avatar: avatar.url,
    });

   
    const user = await User.findById(newUser._id);
    if (!user) {
      return res
        .status(500)
        .json({ error: "Something went wrong while registering the user" });
    }

    return res
      .status(200)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.log(error);
    serverErrorHandler(error, res);
  }
};

exports.login = async (req, res) => {


  try {
    const { countryCode, password, phoneNumber } = req.body;

    console.log("countryCode",countryCode);
    

    if ([countryCode, phoneNumber, password].some((field) => !field?.trim())) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const user = await User.findOne({ phoneNumber: fullPhoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    const loggedInUser = await User.findById(user._id)

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    return res
      .status(200)
      .json({ message: "User signed in successfully", data: loggedInUser });
  } catch (error) {
    serverErrorHandler(error, res);
  }
};

exports.getuser = async (req, res) => {


  
  try {
    const user1 = req.User

    return res
      .status(200)
      .json({message : 'User fetched successfully' , user1 })
  } catch (error) {
    serverErrorHandler(error, res);
  }
};

exports.logout = async (req, res) => {
  try {

    await User.findByIdAndUpdate(
      req.User._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const cookieOptions = { httpOnly: true, secure: true };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    serverErrorHandler(error, res);
  }
};

exports.findAllUsers = async (req, res) => {
  try {

    const currentUserPhoneNumber = req.User.phoneNumber;

 
    const users = await User.find({ phoneNumber: { $ne: currentUserPhoneNumber } }, 'avatar firstName lastName phoneNumber');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    serverErrorHandler(error, res);
  }
};



exports.getRoomId = async (req, res) => {
  try {
    const { selectedUser, currentUser } = req.body;

    if (!selectedUser || !currentUser) {
      return res.status(400).json({ message: 'Both slectedUser and currentUser are required.' });
    }

    let room = await ChatRoom.findOne({
      members: { $all: [selectedUser, currentUser] },
    });

    if (!room) {
      room = new ChatRoom({
        roomId: generateUniqueRoomId(), 
        members: [selectedUser, currentUser],
        messages: [],
      });

      await room.save();
    }

    return res.status(200).json({ roomId: room.roomId });
  } catch (error) {
    serverErrorHandler(error, res);
  }
};

function generateUniqueRoomId() {
  return 'room_' + new Date().getTime(); 
}



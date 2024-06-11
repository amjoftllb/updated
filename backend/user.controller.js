const ApiResponse = require('../utils/ApiResponse.js');
const user = require('../models/user.Models.js');
const uploadOnCloudinary = require('../utils/cloudinary.js');
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require('../models/otp.Models.js')

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const User = await user.findById(userId);
    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

    User.refreshToken = refreshToken;
    await User.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return { error: 'Something went wrong while generating refresh and access tokens' };
  }
};

generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

//controllers
exports.registerUser = async (req, res) => {
  
  try {
    const { firstName, lastName, gender, birthDate, hobbies, email, password } = req.body;
    console.log(req.body);
    if (!firstName || !lastName || !gender || !birthDate || !hobbies || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, null, 'E-mail already exists'));
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json(new ApiResponse(400, null, 'Profile Picture is required'));
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return res.status(400).json(new ApiResponse(400, null, 'Unable to upload profile photo'));
    }

    const newUser = await user.create({
      avatar: avatar.secure_url,
      firstName,
      lastName,
      gender,
      birthDate,
      hobbies,
      email,
      password
    });
    const createdUser = await user.findById(newUser._id).select("-password");

    return res.status(200).json(new ApiResponse(200, createdUser, 'User created successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error?.message, 'Unable to create user. Server error!'));
  }
};

exports.allUser = async (req, res) => {
  try {
    const allUser = await user.aggregate([
      {
        $sort: { firstName: 1 }
      },
      {
        $project: { password: 0, updatedAt: 0, createdAt: 0 }
      }
    ]);
    return res.status(200).json(new ApiResponse(200, allUser, 'Users fetched successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to fetch users. Server error!'));
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { firstName, lastName, gender, birthDate, hobbies, email ,password} = req.body;
    console.log(req.body);
    const updateDetails = await user.findOne({ email });
    const avatarLocalPath = req.file?.path;
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        return res.status(400).json(new ApiResponse(400, null, 'Unable to upload avatar'));
      }
      updateDetails.avatar = avatar.secure_url;
    }

    if (firstName) updateDetails.firstName = firstName.trim();
    if (lastName) updateDetails.lastName = lastName.trim();
    if (gender) updateDetails.gender = gender.trim();
    if (birthDate) updateDetails.birthDate = birthDate.trim();
    if (hobbies) updateDetails.hobbies = hobbies;

   const  updatedUser = await updateDetails.save();
    return res.status(200).json(new ApiResponse(200, updatedUser, 'User details updated successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to update user. Server error!'));
  }
};

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json(new ApiResponse(401, null, 'Email is required'));
    }
    if (!password) {
      return res.status(401).json(new ApiResponse(401, null, 'Password is required'));
    }

    const User = await user.findOne({ email });

    if (!User) {
      return res.status(401).json(new ApiResponse(401, null, 'User does not exist'));
    }
    
    const isPasswordValid = await User.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse(401, null, 'Invalid password'));
    }

    if (User.isVerified) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(User._id);
      if (accessToken.error) {
        return res.status(500).json(new ApiResponse(500, null, 'Unable to generate tokens'));
      }
  
      const loggedInUser = await user.findById(User._id).select("-password -refreshToken");
  
      const options = { httpOnly: true, secure: true };
  
      return res.status(200) // Correct status code for success
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "Login successful"));
    }

    return res.status(401).json(new ApiResponse(401, {isVerified: User.isVerified}, 'user not Verified'))
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to login. Server error!'));
  }
};

exports.logOut = async (req, res) => {
  try {
    await user.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

    const options = { httpOnly: true, secure: true };

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to logout. Server error!'));
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json(new ApiResponse(401, null, 'Unauthorized request'));
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const User = await user.findById(decodedToken._id);
    if (!User) {
      return res.status(401).json(new ApiResponse(401, null, 'Unauthorized request'));
    }

    if (incomingRefreshToken !== User.refreshToken) {
      return res.status(401).json(new ApiResponse(401, null, 'Refresh token is expired or used'));
    }

    const options = { httpOnly: true, secure: true };

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(User._id);
    if (accessToken.error) {
      return res.status(500).json(new ApiResponse(500, null, 'Unable to generate tokens'));
    }

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, null, 'Access token refreshed'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to refresh tokens. Server error!'));
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user1 = req.user;
    return res.status(200).json(new ApiResponse(200, user1, 'User fetched successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Unable to fetch user. Server error!'));
  }
};

exports.RegisterUserverifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body);

    if (!email || !otp) {
      return res.status(400).json(new ApiResponse(400, null, 'Email and OTP are required'));
    }
    const otpRecord = await OTP.findOne({ email, otp });
    console.log(otpRecord);
  
    if (otpRecord) {
      return res.status(200).json(new ApiResponse(200, null, 'OTP verified successfully'));
    }

    return res.status(400).json(new ApiResponse(400, null, 'invalid OTP'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, 'Server error'));
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(new ApiResponse(400, null, 'Email is required'));
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, null, 'User already exists'));
    }

    let otp = generateOTP()
    let otpExists = await OTP.findOne({ otp });
    while (otpExists) {
      otp = generateOTP();
      otpExists = await OTP.findOne({ otp });
    }
    const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
    if (!otpBody) {
      return res.status(400).json(new ApiResponse(400, null, 'Unable to genrate Verification OTP '));
    }

    return res.status(200).json(new ApiResponse(200, null, 'OTP sent successfully'));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error, 'Server error'));
  }
};

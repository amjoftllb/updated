const ApiResponse = require('../utils/ApiResponse.js');
const user = require('../models/user.model.js');
const jwt = require("jsonwebtoken");


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    console.log("amit",userId);
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

//controllers
exports.registerUser = async (req, res) => {
  
  try {
    const { firstName, lastName, gender, birthDate, department, email, password } = req.body;
    console.log(req.body);
    if (!firstName || !lastName || !gender || !birthDate || !department || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, 'All fields are required'));
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, null, 'E-mail already used'));
    }

    const newUser = await user.create({
      firstName,
      lastName,
      gender,
      birthDate,
      department,
      email,
      password,
    });
    const createdUser = await user.findById(newUser._id).select("-password");

    return res.status(200).json(new ApiResponse(200, createdUser, 'User created successfully'));
  } catch (error) {
    
    if (error.name === 'ValidationError') {
      for (let field in error.errors) {error.message = error.errors[field].message;}
    }
    return res.status(500).json(new ApiResponse(500, null, error?.message));
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
    const { firstName, lastName, gender, birthDate, department, email ,newPassword ,oldPassword} = req.body;
  
    const updateDetails = await user.findById(req.user.id);

    if (firstName) updateDetails.firstName = firstName.trim();
    if (email) updateDetails.email = email.trim();
    if (lastName) updateDetails.lastName = lastName.trim();
    if (gender) updateDetails.gender = gender.trim();
    if (birthDate) updateDetails.birthDate = birthDate.trim();
    if (department) updateDetails.department = department;
    if(oldPassword){
        if(!(newPassword)) return res.status(400).json(new ApiResponse(400, null , 'password is requierd'));
    }
    if(newPassword){
        if(!(oldPassword)) return res.status(400).json(new ApiResponse(400, null , 'oldPassword is requierd'));
    }
    if ((oldPassword && newPassword)){

        const isPasswordCorrect = await updateDetails.isPasswordCorrect(oldPassword)
    
        if (!isPasswordCorrect) {
            return res.status(400).json(new ApiResponse(400, null , 'oldPassword wrong'));
        }
        updateDetails.password = newPassword
};

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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(User._id);

    const loggedInUser = await user.findById(User._id).select("-password -refreshToken");
  
      const options = { httpOnly: true, secure: true };
  
      return res.status(200) 
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "Login successful"));
    
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

exports.deleteUserByadmin = async (req, res) => {
    try {
        const {email} = req.body;
        console.log(req.body);
        const result = await user.deleteOne({email});
        console.log(result.deletedCount);
        if ((result.deletedCount == 1)) return res.status(200).json(new ApiResponse(200, null, 'user deleted Sucessfually'));
        if (result.deletedCount == 0) return res.status(200).json(new ApiResponse(200, null, 'user not Found'));
        
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, 'Unable to fetch user. Server error!'));
    }
  };

exports.UpdateUserDetailsByAdmin = async (req, res) => {
    try {
        const { firstName, lastName, gender, birthDate, department, email} = req.body;

        if (!firstName && !lastName && !gender && !birthDate && !department){
            return res.status(400).json(new ApiResponse(400, null, 'pls fill any Field for update'));
        }
  
        const updateDetails = await user.findOne({ email });

            if (firstName) updateDetails.firstName = firstName.trim();
            if (email) updateDetails.email = email.trim();
            if (lastName) updateDetails.lastName = lastName.trim();
            if (gender) updateDetails.gender = gender.trim();
            if (birthDate) updateDetails.birthDate = birthDate.trim();
            if (department) updateDetails.department = department.trim();

            await updateDetails.save({validateBeforeSave: false});

            const  updatedUser = await user.findOne({ email }).select("-password -refreshToken")
            
       return res.status(200).json(new ApiResponse(200, updatedUser, 'user Updated sucessfually'));

    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error.message, 'Unable to fetch user. Server error!'));
    }
  };  

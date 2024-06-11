const cloudinary = require("cloudinary").v2;
const fs = require("fs");


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
    
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

module.exports = uploadOnCloudinary;

//CLOUDINARY_CLOUD_NAME=du4jaiccf   
//CLOUDINARY_API_KEY=865673722824947   
//CLOUDINARY_API_SECRET=cmNiS3ef6GPzxRxhmH0IsUE9Crk

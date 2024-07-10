const ErrorHandler = require("../utils/ErrorHandler.js");
const User = require("../models/user.js");
const category = require("../models/category.js");
const subCategory = require("../models/subCategory.js");
const post = require("../models/post.js");

// controllers-----------------------------------
exports.createCategory = async (req, res) => {
  try {
    const { categoryy } = req.body;
    const category1 = await category.create({name :categoryy});
    console.log(category1);
    if (category1) return res.status(200).json({ message: "category created" });
     
  } catch (error) {
    console.log(error);
    new ErrorHandler("Unable to create Category. Server error!", 500, res);
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { categoryy, subCategoryName } = req.body;
    const existcategory = await category.findOne({ name :categoryy });

    if (!existcategory) {
        return res.status(400).json({ error: "catogery not exist" });  
    }
    const existsubcategory = await subCategory.findOne({ name :subCategoryName });
    if (existsubcategory) {
      return res.status(400).json({ error: "subCategory already exist" });
    }

    const category1 = subCategory.create({categoryId : existcategory._id ,name :subCategoryName });
    if (category1) return res.status(200).json({ message: "subCategory created" });
  } catch (error) {
    console.log(error);
    new ErrorHandler("Unable to create Subcategory. Server error!", 500, res);
  }
};



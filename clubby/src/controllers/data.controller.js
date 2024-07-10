const ErrorHandler = require("../utils/ErrorHandler.js");
const User = require("../models/user.js");
const category = require("../models/category.js");
const subCategory = require("../models/subCategory.js");
const post = require("../models/post.js");

// controllers-----------------------------------
exports.fetchallcategory = async (req, res) => {
  try {
    const allcategory = await category.aggregate([
      {
        $group: {
          _id: null,
          allCategory: { $push: "$name" },
        },
      },
      {
        $project: {
          _id: 0,
          allcategory: "$allCategory",
        },
      },
    ]);

    console.log(allcategory[0]);

    if (allcategory && allcategory.length > 0) {
      return res
        .status(200)
        .json({ message: "allcategory fetched", data: allcategory[0] });
    } else {
      return res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Unable to fetch allcategory. Server error!" });
  }
};

exports.fetchsubcategory = async (req, res) => {
  try {
    const subcategory = await subCategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$categoryId",
          subcategory: { $push: "$name" },
          categoryName: { $first: "$category.name" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: 1,
          subcategory: 1,
        },
      },
    ]);
    console.log(subcategory);
    if (subcategory && subcategory.length > 0) {
      return res
        .status(200)
        .json({
          message: "Subcategories fetched successfully",
          data: subcategory,
        });
    } else {
      return res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    console.log(error);
    new ErrorHandler("Unable to fetch subcategory. Server error!", 500, res);
  }
};

exports.fetchSubCategoryProduct = async (req, res) => {
  try {
    const { subcategory } = req.body;
    console.log(subcategory);
    console.log(req.body);

    if (!subcategory) {
      return res.status(400).json({ message: "pls provide subcategory name" });
    }

    const SubCategoryProduct = await post.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryId",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      {
        $addFields: {
          subcategory: { $arrayElemAt: ["$subcategory", 0] },
        },
      },
      {
        $addFields: {
          subcategory: "$subcategory.name",
        },
      },
      {
        $match: { subcategory },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          price: 1,
          subcategory: "$subcategory",
          productImage: 1,
        },
      },
    ]);

    if (SubCategoryProduct && SubCategoryProduct.length > 0) {
      return res
        .status(200)
        .json({
          message: "Subcategories fetched successfully",
          data: SubCategoryProduct,
        });
    } else {
      return res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    console.log(error);
    new ErrorHandler("Unable to fetch subcategory. Server error!", 500, res);
  }
};


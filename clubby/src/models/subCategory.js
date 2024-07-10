const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: { 
    type: String, 
    required: true 
}
});

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
module.exports = Subcategory;


// [
//   {
//     "categoryId": "Electronics",
//     "name": "Mobile Phones",
//   },
//   {
//     "categoryId": "Fashion",
//     "name": "Men's Clothing",
//   }
// ]

// const subcategory1 = new Subcategory({
//   categoryId: category1._id,
//   name: 'Mobile Phones',
//   createdAt: new Date('2024-07-09T12:20:00Z'),
//   updatedAt: new Date('2024-07-09T12:20:00Z')
// });

// const subcategory2 = new Subcategory({
//   categoryId: category2._id,
//   name: "Men's Clothing",
//   createdAt: new Date('2024-07-09T12:25:00Z'),
//   updatedAt: new Date('2024-07-09T12:25:00Z')
// });


const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
}
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;


// [
//   {
//     "name": "Electronics",
//     "createdAt": "2024-07-09T12:10:00Z",
//     "updatedAt": "2024-07-09T12:10:00Z"
//   },
//   {
//     "name": "Fashion",
//     "createdAt": "2024-07-09T12:15:00Z",
//     "updatedAt": "2024-07-09T12:15:00Z"
//   }
// ]

// const category1 = new Category({
//   name: 'Electronics',
//   createdAt: new Date('2024-07-09T12:10:00Z'),
//   updatedAt: new Date('2024-07-09T12:10:00Z')
// });

// const category2 = new Category({
//   name: 'Fashion',
//   createdAt: new Date('2024-07-09T12:15:00Z'),
//   updatedAt: new Date('2024-07-09T12:15:00Z')
// });

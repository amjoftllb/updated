// src/models/user.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;



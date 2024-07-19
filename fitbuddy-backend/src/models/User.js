const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'trainer'], default: 'user' },
  age: { type: Number },
  gender: { type: String },
  fitnessLevel: { type: String },
  interests: [{ type: String }],
  availability: [{ type: String }],
  location: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  ratings: [{
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String }
  }],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

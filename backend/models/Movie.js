const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  releaseYear: Number,
  genre: String,
  posterUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  averageRating: {
  type: Number,
  default: 0
 },
  reviewCount: {
  type: Number,
  default: 0
 }

});

module.exports = mongoose.model('Movie', movieSchema);

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: [{
    type: String
  }],
  certificate: {
    type: String,
    default: 'PG-13'
  },
  duration: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  banner: {
    type: String
  },
  formats: [{
    type: String,
    enum: ['2D', '3D']
  }],
  cast: [{
    name: String,
    character: String,
    photo: String
  }],
  releaseDate: {
    type: Date
  },
  isNowShowing: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Movie', movieSchema);

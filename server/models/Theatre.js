const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  screens: [{
    screenName: {
      type: String,
      required: true
    },
    formats: [{
      type: String,
      enum: ['2D', '3D']
    }],
    timeSlots: [{
      type: String
    }],
    pricePerFormat: {
      '2D': Number,
      '3D': Number
    }
  }],
  priceRange: {
    min: Number,
    max: Number
  }
});

module.exports = mongoose.model('Theatre', theatreSchema);

const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D'],
    required: true
  },
  seatMap: {
    type: Map,
    of: {
      type: String,
      enum: ['available', 'occupied']
    },
    default: {}
  }
});

screeningSchema.index({ movieId: 1, theatreId: 1, date: 1, time: 1, screen: 1, format: 1 }, { unique: true });

module.exports = mongoose.model('Screening', screeningSchema);

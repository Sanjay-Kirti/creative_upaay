const mongoose = require('mongoose');
const Screening = require('../models/Screening');

exports.getSeatMap = async (req, res) => {
  try {
    const { movieId, theatreId, date, time, screen, format } = req.query;

    if (!movieId || !theatreId || !date || !time || !screen) {
      return res.status(400).json({ message: 'All query parameters are required' });
    }

    const query = { movieId, theatreId, date, time, screen };
    if (format) query.format = format;

    const screening = await Screening.findOne(query);
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }

    const seatMap = {};
    screening.seatMap.forEach((value, key) => {
      seatMap[key] = value;
    });

    res.json({
      screeningId: screening._id,
      seatMap,
      format: screening.format
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Atomic seat reservation using findOneAndUpdate with conditions.
 * This ensures that if two users try to book the same seat simultaneously,
 * only one will succeed — the other will get a 409 Conflict error.
 *
 * Concurrency control: The MongoDB query condition checks that ALL requested
 * seats are still 'available' before setting them to 'occupied' in a single
 * atomic operation. No distributed lock (Redis) is needed for this level of safety.
 */
exports.reserveSeats = async (req, res) => {
  try {
    const { movieId, theatreId, date, time, screen, seats, format } = req.body;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: 'No seats specified' });
    }

    // Build atomic query: only match if ALL requested seats are 'available'
    const query = { movieId, theatreId, date, time, screen };
    if (format) query.format = format;

    // Add conditions: every requested seat must be 'available'
    for (const seat of seats) {
      query[`seatMap.${seat}`] = 'available';
    }

    // Build atomic update: set all seats to 'occupied' in one operation
    const update = {};
    for (const seat of seats) {
      update[`seatMap.${seat}`] = 'occupied';
    }

    // findOneAndUpdate is atomic — if the query doesn't match (seats already taken),
    // result is null and we return a conflict error
    const result = await Screening.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    );

    if (!result) {
      // Query didn't match — one or more seats are already occupied
      return res.status(409).json({
        message: 'One or more selected seats are no longer available. Please select different seats.',
        code: 'SEATS_UNAVAILABLE'
      });
    }

    res.json({ message: 'Seats reserved successfully', screeningId: result._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.releaseSeats = async (req, res) => {
  try {
    const { screeningId, seats } = req.body;

    if (!screeningId || !seats || seats.length === 0) {
      return res.status(400).json({ message: 'screeningId and seats are required' });
    }

    // Atomic release
    const update = {};
    for (const seat of seats) {
      update[`seatMap.${seat}`] = 'available';
    }

    await Screening.findByIdAndUpdate(screeningId, { $set: update });

    res.json({ message: 'Seats released successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

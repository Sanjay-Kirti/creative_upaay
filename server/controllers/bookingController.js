const Booking = require('../models/Booking');
const Screening = require('../models/Screening');

/**
 * Create a booking with manual rollback support.
 *
 * Standalone MongoDB does not support multi-document transactions (requires
 * a replica set). Instead we use a two-phase approach with manual rollback:
 *   1. Atomically reserve seats via findOneAndUpdate (concurrency-safe)
 *   2. Create the Booking document
 *   3. If step 2 fails, manually release the seats (rollback)
 *
 * The atomic findOneAndUpdate in step 1 ensures no double-booking even
 * under concurrent requests.
 */
exports.createBooking = async (req, res) => {
  let reservedScreeningId = null;
  const seatsToReserve = req.body.seats || [];

  try {
    const {
      movieId, theatreId, screen, date, time, format,
      seats, pricePerTicket, bookingFee, totalAmount
    } = req.body;

    // Step 1: Atomically reserve seats (concurrency-safe)
    const query = { movieId, theatreId, date, time, screen };
    if (format) query.format = format;

    // Condition: ALL requested seats must still be 'available'
    for (const seat of seats) {
      query[`seatMap.${seat}`] = 'available';
    }

    const seatUpdate = {};
    for (const seat of seats) {
      seatUpdate[`seatMap.${seat}`] = 'occupied';
    }

    const screening = await Screening.findOneAndUpdate(
      query,
      { $set: seatUpdate },
      { new: true }
    );

    if (!screening) {
      return res.status(409).json({
        message: 'One or more seats are no longer available. Please select different seats.',
        code: 'SEATS_UNAVAILABLE'
      });
    }

    reservedScreeningId = screening._id;

    // Step 2: Create booking document
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    const booking = new Booking({
      userId: req.userId,
      movieId,
      theatreId,
      screeningId: screening._id,
      screen,
      date,
      time,
      format,
      seats,
      pricePerTicket,
      bookingFee: bookingFee || 20,
      totalAmount,
      status: 'active',
      transactionId,
      transactionDate: new Date()
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movieId')
      .populate('theatreId');

    res.status(201).json(populatedBooking);

  } catch (error) {
    console.error('Booking creation failed:', error.message);

    // ROLLBACK: release seats if they were reserved before failure
    if (reservedScreeningId && seatsToReserve.length > 0) {
      try {
        const rollback = {};
        for (const seat of seatsToReserve) {
          rollback[`seatMap.${seat}`] = 'available';
        }
        await Screening.findByIdAndUpdate(reservedScreeningId, { $set: rollback });
        console.log('Rollback successful: seats released');
      } catch (rollbackErr) {
        console.error('CRITICAL: Rollback failed!', rollbackErr.message);
      }
    }

    res.status(500).json({ message: 'Booking failed. Seats have been released.', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('movieId')
      .populate('theatreId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Cancel a booking with manual rollback.
 * Updates booking status to 'cancelled' and releases seats back to 'available'.
 * If seat release fails, the booking status is reverted.
 */
exports.cancelBooking = async (req, res) => {
  let bookingDoc = null;
  let statusChanged = false;

  try {
    bookingDoc = await Booking.findById(req.params.id);
    if (!bookingDoc) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (bookingDoc.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Step 1: Mark booking as cancelled
    bookingDoc.status = 'cancelled';
    await bookingDoc.save();
    statusChanged = true;

    // Step 2: Release seats atomically
    const seatUpdate = {};
    for (const seat of bookingDoc.seats) {
      seatUpdate[`seatMap.${seat}`] = 'available';
    }

    await Screening.findByIdAndUpdate(bookingDoc.screeningId, { $set: seatUpdate });

    res.json({ message: 'Booking cancelled successfully. Seats have been released.', booking: bookingDoc });

  } catch (error) {
    console.error('Cancellation failed:', error.message);

    // ROLLBACK: revert booking status if seat release failed
    if (statusChanged && bookingDoc) {
      try {
        bookingDoc.status = 'active';
        await bookingDoc.save();
        console.log('Rollback successful: booking status reverted to active');
      } catch (rollbackErr) {
        console.error('CRITICAL: Rollback failed!', rollbackErr.message);
      }
    }

    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};

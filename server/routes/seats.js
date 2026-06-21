const express = require('express');
const router = express.Router();
const { getSeatMap, reserveSeats, releaseSeats } = require('../controllers/seatController');
const auth = require('../middleware/auth');

router.get('/', getSeatMap);
router.post('/reserve', auth, reserveSeats);
router.post('/release', auth, releaseSeats);

module.exports = router;

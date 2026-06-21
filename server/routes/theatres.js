const express = require('express');
const router = express.Router();
const { getAllTheatres, getSchedules } = require('../controllers/theatreController');

router.get('/', getAllTheatres);
router.get('/:id/schedules', getSchedules);

module.exports = router;

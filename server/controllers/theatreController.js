const Theatre = require('../models/Theatre');
const Screening = require('../models/Screening');

exports.getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({});
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, date } = req.query;

    if (!movieId || !date) {
      return res.status(400).json({ message: 'movieId and date are required' });
    }

    const theatre = await Theatre.findById(id);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    const screenings = await Screening.find({
      movieId,
      theatreId: id,
      date
    });

    const scheduleByScreen = {};
    for (const screening of screenings) {
      if (!scheduleByScreen[screening.screen]) {
        scheduleByScreen[screening.screen] = {
          screenName: screening.screen,
          formats: [],
          timeSlots: []
        };
      }
      const screenData = scheduleByScreen[screening.screen];

      if (!screenData.formats.includes(screening.format)) {
        screenData.formats.push(screening.format);
      }
      if (!screenData.timeSlots.find(ts => ts.time === screening.time && ts.format === screening.format)) {
        screenData.timeSlots.push({
          time: screening.time,
          format: screening.format,
          screeningId: screening._id
        });
      }
    }

    res.json({
      theatre,
      screens: Object.values(scheduleByScreen)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

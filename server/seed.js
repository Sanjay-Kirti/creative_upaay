const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Screening = require('./models/Screening');

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);
const TIME_SLOTS = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

function generateSeatMap() {
  const seatMap = new Map();
  for (const row of ROWS) {
    for (const col of COLS) {
      const seatId = `${row}${col}`;
      seatMap.set(seatId, Math.random() < 0.3 ? 'occupied' : 'available');
    }
  }
  return seatMap;
}

// Placeholder cast avatar generator
const avatar = (name, bg) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=185&bold=true`;

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Screening.deleteMany({});

    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@movieapp.com',
      passwordHash: 'demo1234'
    });
    await demoUser.save();
    console.log('Demo user created');

    const movies = await Movie.insertMany([
      {
        title: 'Meg 2: The Trench',
        description: 'A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.',
        genre: ['Action', 'Sci-fi', 'Horror'],
        certificate: 'PG-13',
        duration: '1h 56m',
        rating: 4.5,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Meg_2_The_Trench.jpg/800px-Meg_2_The_Trench.jpg',
        formats: ['2D', '3D'],
        cast: [
          { name: 'Jason Statham', character: 'Jonas Taylor', photo: avatar('Jason S', '1d4ed8') },
          { name: 'Jing Wu', character: 'Jiuming Zhang', photo: avatar('Jing W', '0891b2') },
          { name: 'Shuya Sophia Cai', character: 'Meiying', photo: avatar('Shuya C', '0e7490') },
          { name: 'Cliff Curtis', character: 'Mac', photo: avatar('Cliff C', '164e63') }
        ],
        releaseDate: new Date('2026-06-10'),
        isNowShowing: true
      },
      {
        title: 'The Nun II',
        description: 'In 1956 France, a priest is murdered. An evil is spreading. The sequel to the worldwide smash hit follows Sister Irene as she once again comes face-to-face with Valak, the demon nun.',
        genre: ['Horror'],
        certificate: 'R',
        duration: '1h 50m',
        rating: 4.5,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/The_Nun_II_theatrical_poster.jpg/800px-The_Nun_II_theatrical_poster.jpg',
        formats: ['2D', '3D'],
        cast: [
          { name: 'Taissa Farmiga', character: 'Sister Irene', photo: avatar('Taissa F', '4c1d95') },
          { name: 'Jonas Bloquet', character: 'Maurice', photo: avatar('Jonas B', '5b21b6') },
          { name: 'Storm Reid', character: 'Debra', photo: avatar('Storm R', '6d28d9') }
        ],
        releaseDate: new Date('2026-06-15'),
        isNowShowing: true
      },
      {
        title: 'Fast X',
        description: 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes, who swears to destroy everything and everyone Dom loves.',
        genre: ['Action', 'Adventure'],
        certificate: 'PG-13',
        duration: '2h 21m',
        rating: 4.5,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Fast_X_poster.jpg/800px-Fast_X_poster.jpg',
        formats: ['2D', '3D'],
        cast: [
          { name: 'Vin Diesel', character: 'Dominic Toretto', photo: avatar('Vin D', 'b45309') },
          { name: 'Michelle Rodriguez', character: 'Letty Ortiz', photo: avatar('Michelle R', 'b91c1c') },
          { name: 'Jason Momoa', character: 'Dante', photo: avatar('Jason M', '991b1b') }
        ],
        releaseDate: new Date('2026-06-05'),
        isNowShowing: true
      },
      {
        title: 'John Wick: Chapter 4',
        description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face a new enemy with powerful alliances across the globe.',
        genre: ['Action', 'Thriller'],
        certificate: 'R',
        duration: '2h 49m',
        rating: 4.8,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/John_Wick_Chapter_4_poster.jpg/800px-John_Wick_Chapter_4_poster.jpg',
        formats: ['2D', '3D'],
        cast: [
          { name: 'Keanu Reeves', character: 'John Wick', photo: avatar('Keanu R', '1e3a5f') },
          { name: 'Donnie Yen', character: 'Caine', photo: avatar('Donnie Y', '14532d') },
          { name: 'Bill Skarsgård', character: 'Marquis', photo: avatar('Bill S', '1c1917') }
        ],
        releaseDate: new Date('2026-07-15'),
        isNowShowing: false
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        genre: ['Drama', 'History'],
        certificate: 'R',
        duration: '3h 0m',
        rating: 4.9,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/800px-Oppenheimer_%28film%29.jpg',
        formats: ['2D'],
        cast: [
          { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer', photo: avatar('Cillian M', '312e81') },
          { name: 'Emily Blunt', character: 'Kitty Oppenheimer', photo: avatar('Emily B', '3730a3') },
          { name: 'Robert Downey Jr.', character: 'Lewis Strauss', photo: avatar('Robert D', '4338ca') }
        ],
        releaseDate: new Date('2026-07-21'),
        isNowShowing: false
      },
      {
        title: 'Barbie',
        description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
        genre: ['Comedy', 'Fantasy', 'Adventure'],
        certificate: 'PG-13',
        duration: '1h 54m',
        rating: 4.6,
        banner: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Barbie_2023_film_poster.jpg/800px-Barbie_2023_film_poster.jpg',
        formats: ['2D', '3D'],
        cast: [
          { name: 'Margot Robbie', character: 'Barbie', photo: avatar('Margot R', 'db2777') },
          { name: 'Ryan Gosling', character: 'Ken', photo: avatar('Ryan G', 'be185d') },
          { name: 'America Ferrera', character: 'Gloria', photo: avatar('America F', '9d174d') }
        ],
        releaseDate: new Date('2026-07-21'),
        isNowShowing: false
      }
    ]);
    console.log(`${movies.length} movies seeded`);

    const theatres = await Theatre.insertMany([
      {
        name: 'The Grandview',
        location: 'Camp Aguinaldo, Quezon City',
        logo: 'https://ui-avatars.com/api/?name=GV&background=4f46e5&color=fff&size=120&font-size=0.4&bold=true',
        screens: [
          { screenName: 'Screen 1', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 320, '3D': 450 } },
          { screenName: 'Screen 2', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 320, '3D': 450 } }
        ],
        priceRange: { min: 320, max: 450 }
      },
      {
        name: 'Play Loft',
        location: 'Aurora Boulevard, Santa Mesa',
        logo: 'https://ui-avatars.com/api/?name=PL&background=7c3aed&color=fff&size=120&font-size=0.4&bold=true',
        screens: [
          { screenName: 'Screen 1', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 300, '3D': 430 } },
          { screenName: 'Screen 2', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 300, '3D': 430 } }
        ],
        priceRange: { min: 300, max: 430 }
      },
      {
        name: 'CinemaOne',
        location: 'A Cruz, Pasay City',
        logo: 'https://ui-avatars.com/api/?name=C1&background=dc2626&color=fff&size=120&font-size=0.4&bold=true',
        screens: [
          { screenName: 'Screen 1', formats: ['2D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 320 } },
          { screenName: 'Screen 2', formats: ['2D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 320 } }
        ],
        priceRange: { min: 320, max: 320 }
      },
      {
        name: 'Cinemount',
        location: 'Baclaran, Paranaque City',
        logo: 'https://ui-avatars.com/api/?name=CM&background=d97706&color=fff&size=120&font-size=0.4&bold=true',
        screens: [
          { screenName: 'Screen 1', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 350, '3D': 350 } },
          { screenName: 'Screen 2', formats: ['2D', '3D'], timeSlots: TIME_SLOTS, pricePerFormat: { '2D': 350, '3D': 350 } }
        ],
        priceRange: { min: 350, max: 350 }
      }
    ]);
    console.log(`${theatres.length} theatres seeded`);

    const today = new Date();
    const screenings = [];

    for (const movie of movies) {
      if (!movie.isNowShowing) continue;
      for (const theatre of theatres) {
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const date = new Date(today);
          date.setDate(date.getDate() + dayOffset);
          const dateStr = date.toISOString().split('T')[0];

          for (const screen of theatre.screens) {
            for (const format of screen.formats) {
              if (!movie.formats.includes(format)) continue;
              for (const time of TIME_SLOTS) {
                screenings.push({
                  movieId: movie._id,
                  theatreId: theatre._id,
                  screen: screen.screenName,
                  date: dateStr,
                  time,
                  format,
                  seatMap: generateSeatMap()
                });
              }
            }
          }
        }
      }
    }

    if (screenings.length > 0) {
      await Screening.insertMany(screenings);
    }
    console.log(`${screenings.length} screenings seeded`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

// ─── Movie Banners ───────────────────────────────────────────────────────────
// meg2-banner.jpg → Home hero, Booking Summary, Payment Success, My Bookings
import meg2Banner from './meg2-banner.jpg';
// meg2-banner-2.jpg → Movie Details page banner only
import meg2Banner2 from './meg2-banner-2.jpg';

// ─── Movie Posters ───────────────────────────────────────────────────────────
// Used in Home page horizontal scroll cards only
import meg2Poster from './meg2.jpg';
import nun2Poster from './nun2.jpg';
import fastxPoster from './fastx.jpg';
import johnwickPoster from './johnwick.jpg';

// ─── Theatre Logos ───────────────────────────────────────────────────────────
// Used in Select Theatre page + Home page theatre list
import grandviewLogo from './grandview-logo.png';
import playloftLogo from './playloft-logo.png';
import cinemaoneLogo from './cinemaone-logo.png';
import cinemountLogo from './cinemount-logo.png';

// ─── Cast Photos ─────────────────────────────────────────────────────────────
// Used in Movie Details cast section
import jasonStatham from './jason-statham.jpg';
import jingWu from './jing-wu.jpg';
import shuyaSophia from './shuya-sophia.jpg';

// ─── App Icon ────────────────────────────────────────────────────────────────
// Used on Login page only
import appIcon from './app-icon.png';

// ─────────────────────────────────────────────────────────────────────────────
// Lookup maps — keyed on movie title / theatre name / cast name
// ─────────────────────────────────────────────────────────────────────────────

/** Hero banner for Home, Booking Summary, Payment Success, My Bookings */
export const movieBannerMap = {
  'Meg 2: The Trench': meg2Banner,
};

/** Banner used ONLY on the Movie Details page */
export const movieDetailsBannerMap = {
  'Meg 2: The Trench': meg2Banner2,
};

/** Poster images used on Home page movie cards */
export const moviePosterMap = {
  'Meg 2: The Trench': meg2Poster,
  'The Nun II': nun2Poster,
  'Fast X': fastxPoster,
  'John Wick: Chapter 4': johnwickPoster,
};

/** Theatre logos used in Select Theatre + Home theatre list */
export const theatreLogoMap = {
  'The Grandview': grandviewLogo,
  'Play Loft': playloftLogo,
  'CinemaOne': cinemaoneLogo,
  'Cinemount': cinemountLogo,
};

/** Cast photos used in Movie Details cast section */
export const castPhotoMap = {
  'Jason Statham': jasonStatham,
  'Jing Wu': jingWu,
  'Shuya Sophia Cai': shuyaSophia,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper getters — fall through gracefully if no local asset exists
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the hero-banner local asset for the given movie title, or null */
export const getMovieBanner = (title) => movieBannerMap[title] ?? null;

/** Returns the movie-details banner local asset, falling back to hero banner */
export const getMovieDetailsBanner = (title) =>
  movieDetailsBannerMap[title] ?? movieBannerMap[title] ?? null;

/** Returns the poster local asset for movie cards */
export const getMoviePoster = (title) => moviePosterMap[title] ?? null;

/** Returns the theatre logo local asset */
export const getTheatreLogo = (name) => theatreLogoMap[name] ?? null;

/** Returns the cast photo local asset */
export const getCastPhoto = (name) => castPhotoMap[name] ?? null;

export { appIcon };

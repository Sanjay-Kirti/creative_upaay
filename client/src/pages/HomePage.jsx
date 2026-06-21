import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMovie } from '../store/movieSlice';
import MovieCard from '../components/MovieCard';
import TheatreCard from '../components/TheatreCard';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { getMovieBanner } from '../assets/images';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [activeTab, setActiveTab] = useState('now_showing');
  const [loading, setLoading] = useState(true);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatresRes] = await Promise.all([
          api.get('/movies'),
          api.get('/theatres')
        ]);
        setMovies(moviesRes.data);
        setTheatres(theatresRes.data);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-cycle hero banner every 3s
  useEffect(() => {
    const nowShowing = movies.filter(m => m.isNowShowing);
    if (nowShowing.length < 2) return;
    const interval = setInterval(() => {
      setFeaturedIdx(i => (i + 1) % nowShowing.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [movies]);

  const filteredMovies = movies.filter(m =>
    activeTab === 'now_showing' ? m.isNowShowing : !m.isNowShowing
  );

  const nowShowingMovies = movies.filter(m => m.isNowShowing);
  const featuredMovie = nowShowingMovies[featuredIdx];

  // Resolve local banner; fall back to API URL if no local asset exists
  const heroBanner = featuredMovie
    ? (getMovieBanner(featuredMovie.title) || featuredMovie.banner)
    : null;

  const handleMovieClick = (movie) => {
    dispatch(setSelectedMovie(movie));
    navigate(`/movie/${movie._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1">
        {/* Hero Banner */}
        <div className="relative w-full h-[240px] bg-gray-900 overflow-hidden">
          {heroBanner && (
            <img
              key={featuredMovie._id}
              src={heroBanner}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-top transition-opacity duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Search button */}
          <button
            id="search-btn"
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <HiOutlineMagnifyingGlass className="w-5 h-5 text-white" />
          </button>

          {/* Featured title overlay */}
          {featuredMovie && (
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">Now Showing</p>
              <h2 className="text-white text-xl font-bold line-clamp-1">{featuredMovie.title}</h2>
              <p className="text-white/70 text-xs mt-0.5">{featuredMovie.genre?.join(' · ')}</p>
            </div>
          )}

          {/* Dots indicator */}
          {nowShowingMovies.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              {nowShowingMovies.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === featuredIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white">
          {/* Movie Tabs */}
          <div className="flex items-center justify-between px-4 pt-6 pb-4">
            <div className="flex gap-6">
              <button
                id="now-showing-tab"
                onClick={() => setActiveTab('now_showing')}
                className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'now_showing'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400'
                  }`}
              >
                Now Showing
              </button>
              <button
                id="coming-soon-tab"
                onClick={() => setActiveTab('coming_soon')}
                className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'coming_soon'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400'
                  }`}
              >
                Coming Soon
              </button>
            </div>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>

          {/* Movie Cards */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>

          {/* Theatres Section */}
          <div className="flex items-center justify-between px-4 mt-4 mb-3">
            <h2 className="text-base font-bold text-gray-900">Movie Theatres</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>

          <div className="divide-y divide-gray-100 px-4 pb-6">
            {theatres.map((theatre) => (
              <TheatreCard key={theatre._id} theatre={theatre} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;

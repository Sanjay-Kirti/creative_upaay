import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedMovie } from '../store/movieSlice';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { getMovieDetailsBanner, getCastPhoto } from '../assets/images';
import { HiOutlineHeart, HiStar } from 'react-icons/hi2';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data);
        dispatch(setSelectedMovie(data));
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, dispatch]);

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Use local details banner; fall back to API URL
  const detailsBanner = getMovieDetailsBanner(movie.title) || movie.banner;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1">
        {/* Banner */}
        <div className="relative w-full h-[240px]">
          <img src={detailsBanner} alt={movie.title} className="w-full h-full object-cover" />
          <button
            id="close-movie-details"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-white text-sm font-medium"
          >
            Close
          </button>
          <button
            id="favorite-btn"
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center"
          >
            <HiOutlineHeart className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Details content */}
        <div className="px-4 bg-white">
          {/* Title row */}
          <div className="flex items-center gap-3 mt-5">
            <h1 className="text-lg font-bold text-gray-900">{movie.title}</h1>
            <span className="px-2 py-0.5 border border-primary text-primary text-xs font-medium rounded-md">
              {movie.certificate}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <HiStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{movie.rating}</span>
            </div>
          </div>

          {/* Genre */}
          <p className="text-sm text-gray-500 mt-1.5">{movie.genre?.join(', ')}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mt-5">{movie.description}</p>

          {/* Format Available */}
          <h3 className="font-bold text-base text-gray-900 mt-7 mb-3">Format Available</h3>
          <div className="flex gap-3">
            {movie.formats?.map((format) => (
              <span
                key={format}
                className="w-12 h-12 flex items-center justify-center border border-primary text-primary text-sm font-medium rounded-lg"
              >
                {format}
              </span>
            ))}
          </div>

          {/* Release Date */}
          <h3 className="font-bold text-base text-gray-900 mt-7 mb-3">Release Date</h3>
          <p className="text-sm text-gray-500">{formatDate(movie.releaseDate)}</p>

          {/* Cast */}
          <h3 className="font-bold text-base text-gray-900 mt-7 mb-3">Cast</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {movie.cast?.map((member, idx) => {
              const photo = getCastPhoto(member.name) || member.photo;
              return (
                <div key={idx} className="flex flex-col items-center flex-shrink-0">
                  <img
                    src={photo}
                    alt={member.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap mt-2">{member.name}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{member.character}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Get Tickets button — in flow, not fixed */}
        <div className="px-4 mt-6 mb-6">
          <button
            id="get-tickets-btn"
            onClick={() => navigate(`/select-theatre/${movie._id}`)}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Get Tickets
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MovieDetailsPage;

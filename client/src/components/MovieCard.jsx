import { HiStar } from 'react-icons/hi2';
import { getMoviePoster } from '../assets/images';

const MovieCard = ({ movie, onClick }) => {
  // Use local poster if available; fall back to API URL
  const poster = getMoviePoster(movie.title) || movie.banner;

  return (
    <div
      id={`movie-card-${movie._id}`}
      className="flex-shrink-0 w-[140px] cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <div className="relative rounded-lg overflow-hidden h-[200px]">
        <img
          src={poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1">
          <HiStar className="w-3 h-3 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-800">{movie.rating}</span>
        </div>
      </div>
      <h3 className="font-bold text-sm text-gray-900 mt-2 line-clamp-2">{movie.title}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{movie.genre?.join(', ')}</p>
    </div>
  );
};

export default MovieCard;

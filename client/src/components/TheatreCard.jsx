import { HiOutlineMapPin } from 'react-icons/hi2';
import { getTheatreLogo } from '../assets/images';

const TheatreCard = ({ theatre, onClick }) => {
  const priceText = theatre.priceRange?.min === theatre.priceRange?.max
    ? `₹${theatre.priceRange.min}`
    : `₹${theatre.priceRange?.min} - ₹${theatre.priceRange?.max}`;

  // Use local logo if available; fall back to API URL
  const logo = getTheatreLogo(theatre.name) || theatre.logo;

  return (
    <div
      id={`theatre-card-${theatre._id}`}
      className="flex items-center gap-4 py-4 cursor-pointer"
      onClick={() => onClick?.(theatre)}
    >
      <img
        src={logo}
        alt={theatre.name}
        className="w-16 h-16 rounded-xl object-contain flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-gray-900">{theatre.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <HiOutlineMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 truncate">{theatre.location}</span>
        </div>
        <p className="text-sm font-bold text-indigo-600 mt-1">{priceText}</p>
      </div>
    </div>
  );
};

export default TheatreCard;

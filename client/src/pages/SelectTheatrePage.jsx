import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTheatre, setSelectedDate } from '../store/theatreSlice';
import ProgressBar from '../components/ProgressBar';
import DatePicker from '../components/DatePicker';
import TheatreCard from '../components/TheatreCard';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { getMovieBanner } from '../assets/images';
import { HiArrowLeft } from 'react-icons/hi2';

const SelectTheatrePage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie } = useSelector((state) => state.movie);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const [dates] = useState(generateDates());
  const [selectedDateLocal, setSelectedDateLocal] = useState(dates[0]);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/theatres');
        setTheatres(data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTheatres();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDateLocal(date);
    dispatch(setSelectedDate(date));
  };

  const handleTheatreSelect = (theatre) => {
    dispatch(setSelectedTheatre(theatre));
    dispatch(setSelectedDate(selectedDateLocal));
    navigate('/schedule');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1">
        {/* Banner with overlay */}
        <div className="relative w-full h-[200px]">
          <img
            src={getMovieBanner(selectedMovie?.title) || selectedMovie?.banner}
            alt={selectedMovie?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute top-5 left-4 flex items-center gap-2">
            <button id="back-btn" onClick={() => navigate(-1)} className="flex items-center gap-1 text-white text-sm font-medium">
              <HiArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
          <button
            id="cancel-btn"
            onClick={handleCancel}
            className="absolute top-5 right-4 text-white text-sm font-medium"
          >
            Cancel
          </button>
          <div className="absolute bottom-5 left-4">
            <h1 className="text-xl font-bold text-white">{selectedMovie?.title}</h1>
            <p className="text-sm text-white/80 mt-1">{selectedMovie?.genre?.join(', ')}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-4 pb-2">
          <ProgressBar percent={15} />
        </div>

        {/* Content */}
        <div className="px-4">
          {/* Heading */}
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-5">Select Movie Theatre</h2>

          <DatePicker
            dates={dates}
            selectedDate={selectedDateLocal}
            onSelect={handleDateSelect}
          />

          {/* Divider */}
          <div className="border-b border-gray-100 mt-5 mb-4" />

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 pb-6">
              {theatres.map((theatre) => (
                <TheatreCard
                  key={theatre._id}
                  theatre={theatre}
                  onClick={handleTheatreSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SelectTheatrePage;

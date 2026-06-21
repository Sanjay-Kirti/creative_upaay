import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFormat, setSelectedScreen, setSelectedTime, setPricePerTicket } from '../store/scheduleSlice';
import ProgressBar from '../components/ProgressBar';
import TimeSlotButton from '../components/TimeSlotButton';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { getMovieBanner } from '../assets/images';
import { HiArrowLeft, HiOutlineBuildingOffice2, HiOutlineCalendar } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const SchedulePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie } = useSelector((state) => state.movie);
  const { selectedTheatre, selectedDate } = useSelector((state) => state.theatre);
  const { selectedFormat, selectedScreen, selectedTime } = useSelector((state) => state.schedule);

  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState(selectedFormat || '2D');

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!selectedTheatre?._id || !selectedMovie?._id || !selectedDate) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/theatres/${selectedTheatre._id}/schedules`, {
          params: { movieId: selectedMovie._id, date: selectedDate }
        });
        setScheduleData(data);
      } catch {
        toast.error('Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [selectedTheatre, selectedMovie, selectedDate]);

  const handleFormatChange = (f) => {
    setFormat(f);
    dispatch(setSelectedFormat(f));
    dispatch(setSelectedScreen(null));
    dispatch(setSelectedTime(null));
  };

  const handleTimeSelect = (screenName, time) => {
    dispatch(setSelectedScreen(screenName));
    dispatch(setSelectedTime(time));
    dispatch(setSelectedFormat(format));

    const theatre = scheduleData?.theatre;
    if (theatre) {
      const screen = theatre.screens?.find(s => s.screenName === screenName);
      if (screen?.pricePerFormat) {
        const price = screen.pricePerFormat[format] || 0;
        dispatch(setPricePerTicket(price));
      }
    }
  };

  const handleGetTickets = () => {
    if (!selectedScreen || !selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    navigate('/seats');
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const priceRange = selectedTheatre?.priceRange;
  const priceText = priceRange?.min === priceRange?.max
    ? `₹${priceRange?.min}`
    : `₹${priceRange?.min} - ₹${priceRange?.max}`;

  // Local banner
  const banner = getMovieBanner(selectedMovie?.title) || selectedMovie?.banner;

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5]">
      <div className="flex-1 flex flex-col">
        {/* Banner */}
        <div className="relative w-full h-[200px]">
          <img src={banner} alt={selectedMovie?.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute top-5 left-4">
            <button id="back-btn" onClick={() => navigate(-1)} className="flex items-center gap-1 text-white text-sm font-medium">
              <HiArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
          <button id="cancel-btn" onClick={() => navigate('/home')} className="absolute top-5 right-4 text-white text-sm font-medium">
            Cancel
          </button>
          <div className="absolute bottom-5 left-4">
            <h1 className="text-xl font-bold text-white">{selectedMovie?.title}</h1>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <HiOutlineBuildingOffice2 className="w-4 h-4" />
                {selectedTheatre?.name}
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <HiOutlineCalendar className="w-4 h-4" />
                {formatDateDisplay(selectedDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 pt-6 mb-6">
          <ProgressBar percent={35} />
        </div>

        {/* Content */}
        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Choose Schedule</h2>

          {/* Format selector */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-semibold text-gray-900">Format</span>
            {selectedMovie?.formats?.map((f) => (
              <button
                key={f}
                id={`format-${f}`}
                onClick={() => handleFormatChange(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-colors ${format === f
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-600'
                  }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-400 font-medium">{priceText}</span>
          </div>

          <div className="border-b border-gray-200 mb-8" />

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            scheduleData?.screens?.map((screen, idx) => {
              const filteredSlots = screen.timeSlots?.filter(ts => ts.format === format) || [];
              if (filteredSlots.length === 0) return null;

              return (
                <div key={screen.screenName} className={idx > 0 ? 'mt-10' : ''}>
                  <h3 className="font-bold text-base text-gray-900 mb-5">{screen.screenName}</h3>
                  <div className="flex flex-wrap gap-3">
                    {filteredSlots.map((slot) => (
                      <TimeSlotButton
                        key={`${screen.screenName}-${slot.time}`}
                        time={slot.time}
                        isSelected={selectedScreen === screen.screenName && selectedTime === slot.time}
                        isAvailable={true}
                        onClick={(time) => handleTimeSelect(screen.screenName, time)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Get Tickets button — pinned to bottom */}
        <div className="px-4 mb-6">
          <button
            id="get-tickets-btn"
            onClick={handleGetTickets}
            className="w-full py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-colors text-base"
          >
            Get Tickets
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SchedulePage;

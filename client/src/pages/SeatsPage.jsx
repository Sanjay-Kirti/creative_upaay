import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSeatSelection } from '../hooks/useSeatSelection';
import ProgressBar from '../components/ProgressBar';
import SeatGrid from '../components/SeatGrid';
import SeatLegend from '../components/SeatLegend';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const SeatsPage = () => {
  const navigate = useNavigate();
  const { selectedMovie } = useSelector((state) => state.movie);
  const { selectedTheatre, selectedDate } = useSelector((state) => state.theatre);
  const { selectedFormat, selectedScreen, selectedTime, pricePerTicket } = useSelector((state) => state.schedule);
  const { seatMap, selectedSeats, totalPrice, handleSeatClick, initSeatMap, resetSeats } = useSeatSelection();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        resetSeats();
        const { data } = await api.get('/seats', {
          params: {
            movieId: selectedMovie?._id,
            theatreId: selectedTheatre?._id,
            date: selectedDate,
            time: selectedTime,
            screen: selectedScreen,
            format: selectedFormat
          }
        });
        initSeatMap(data.seatMap, data.screeningId);
      } catch {
        toast.error('Failed to load seats');
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, []);

  const handleViewSummary = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    navigate('/booking-summary');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3">
          <button id="back-btn" onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-900 text-sm font-medium">
            <HiArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button id="cancel-btn" onClick={() => navigate('/home')} className="text-gray-500 text-sm font-medium">
            Cancel
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 pb-5">
          <ProgressBar percent={65} />
        </div>

        {/* Title */}
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Select Seats</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900">{selectedScreen}</span>
              <span className="text-sm font-medium text-primary">{selectedTime}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">₹{totalPrice || pricePerTicket * selectedSeats.length}</span>
          </div>
        </div>

        {/* Seat Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="px-4 mt-4">
              <SeatGrid seatMap={seatMap} onSeatClick={handleSeatClick} />
            </div>
            <div className="px-4 mt-6">
              <SeatLegend />
            </div>
          </>
        )}

        {/* Action button */}
        <div className="px-4 mt-8 mb-6">
          <button
            id="view-summary-btn"
            onClick={handleViewSummary}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            View Booking Summary
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SeatsPage;

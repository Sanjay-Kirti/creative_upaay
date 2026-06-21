import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';
import { getMovieBanner } from '../assets/images';
import { HiArrowLeft, HiOutlineBuildingOffice2, HiOutlineCalendar } from 'react-icons/hi2';

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const { selectedMovie } = useSelector((state) => state.movie);
  const { selectedTheatre, selectedDate } = useSelector((state) => state.theatre);
  const { selectedFormat, selectedScreen, selectedTime, pricePerTicket } = useSelector((state) => state.schedule);
  const { selectedSeats, totalPrice } = useSelector((state) => state.seat);
  const { bookingFee } = useSelector((state) => state.booking);

  const ticketTotal = selectedSeats.length * pricePerTicket;
  const grandTotal = ticketTotal + bookingFee;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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
          <ProgressBar percent={80} />
        </div>

        <div className="px-4">
          <h2 className="text-xl font-bold text-gray-900 mt-2 mb-6">Booking Summary</h2>

          {/* Movie banner */}
          <img
            src={getMovieBanner(selectedMovie?.title) || selectedMovie?.banner}
            alt={selectedMovie?.title}
            className="w-full h-[180px] object-cover rounded-lg"
          />

          {/* Movie title */}
          <h3 className="text-lg font-bold text-gray-900 mt-5 mb-3">{selectedMovie?.title}</h3>

          {/* Info row */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <HiOutlineBuildingOffice2 className="w-4 h-4 text-gray-400" />
              {selectedTheatre?.name}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
              {formatDate(selectedDate)}
            </div>
          </div>

          {/* Screen info */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm font-bold text-gray-900">{selectedScreen}</span>
            <span className="text-sm font-medium text-primary">{selectedTime}</span>
            <span className="text-sm text-gray-600">{selectedFormat}</span>
          </div>

          {/* Seats */}
          <div className="flex items-center gap-2 mt-5">
            <span className="text-sm font-medium text-gray-700">Seats</span>
            <div className="flex gap-1.5">
              {selectedSeats.map((seat) => (
                <span key={seat} className="bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-200 mt-6 mb-5" />

          {/* Price breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{selectedSeats.length}x Tickets</span>
              <span className="text-gray-700">₹{ticketTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Booking Fee</span>
              <span className="text-gray-700">₹{bookingFee}</span>
            </div>
            <div className="border-b border-gray-200 my-3" />
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Proceed button */}
        <div className="px-4 mt-8 mb-6">
          <button
            id="proceed-payment-btn"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BookingSummaryPage;

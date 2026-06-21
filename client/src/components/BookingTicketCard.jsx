import QRCodeDisplay from './QRCodeDisplay';
import { getMovieBanner } from '../assets/images';

const BookingTicketCard = ({ booking, showCancel = false, onCancel }) => {
  const movie = booking.movieId || {};
  const theatre = booking.theatreId || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTransactionDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Movie banner — meg2-banner.jpg */}
      <img
        src={getMovieBanner(movie.title) || movie.banner}
        alt={movie.title}
        className="w-full h-[180px] object-cover"
      />

      {/* Card content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{movie.title}</h3>

        <div className="grid grid-cols-2 gap-4 mt-3">
          {/* Left column */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">{theatre.name}</p>
            <p className="text-sm text-primary font-medium">{formatDate(booking.date)}</p>
            <div>
              <p className="text-sm text-gray-600">Seats:</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {booking.seats?.map((seat) => (
                  <span
                    key={seat}
                    className="bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded-md"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            {showCancel && booking.status === 'active' && (
              <button
                id="cancel-booking-btn"
                onClick={() => onCancel?.(booking._id)}
                className="mt-2 px-4 py-1.5 border border-cancel-red text-cancel-red text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700 font-medium">
              {booking.screen} - {booking.format}
            </p>
            <p className="text-sm text-primary font-medium">{booking.time}</p>
            <div>
              <p className="text-sm text-gray-600">Amount Paid:</p>
              <p className="text-sm font-bold text-gray-900">₹{booking.totalAmount}</p>
            </div>
            <div className="flex justify-end">
              <QRCodeDisplay value={booking.transactionId || booking._id} size={80} />
            </div>
          </div>
        </div>

        {/* Transaction date */}
        <div className="mt-3 pt-2">
          <p className="text-xs text-gray-400">
            Transaction Date:{' '}
            <span className="text-gray-500">{formatTransactionDate(booking.transactionDate)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingTicketCard;

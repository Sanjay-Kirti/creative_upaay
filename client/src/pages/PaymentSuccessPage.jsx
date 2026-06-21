import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useBooking } from '../hooks/useBooking';
import BookingTicketCard from '../components/BookingTicketCard';
import BottomNav from '../components/BottomNav';
import { HiCheck } from 'react-icons/hi2';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { currentBooking } = useSelector((state) => state.booking);
  const { clearBookingFlow } = useBooking();

  const handleClose = () => {
    clearBookingFlow();
    navigate('/home');
  };

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-gray-500">No booking found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <div className="flex-1">
        {/* Close button */}
        <div className="flex justify-end px-4 pt-6">
          <button
            id="close-success"
            onClick={handleClose}
            className="text-sm text-gray-500 font-medium"
          >
            Close
          </button>
        </div>

        {/* Success icon */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <HiCheck className="w-14 h-14 text-success-green" strokeWidth={2} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Payment Successful!</h2>
        </div>

        {/* Ticket card */}
        <div className="px-4">
          <BookingTicketCard booking={currentBooking} />
        </div>

        {/* Info text */}
        <p className="text-sm text-gray-500 text-center px-8 mt-6 mb-6">
          You may view all purchased tickets in the ticket page.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default PaymentSuccessPage;

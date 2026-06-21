import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setMyBookings, setPastBookings, moveBookingToPast } from '../store/bookingsHistorySlice';
import BookingTicketCard from '../components/BookingTicketCard';
import CancelModal from '../components/CancelModal';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myBookings, pastBookings } = useSelector((state) => state.bookingsHistory);
  const [activeTab, setActiveTab] = useState('my');
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null); // bookingId to cancel

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;
      try {
        const { data } = await api.get(`/bookings/user/${user._id}`);
        const active = data.filter(b => b.status === 'active');
        const past = data.filter(b => b.status === 'cancelled');
        dispatch(setMyBookings(active));
        dispatch(setPastBookings(past));
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, dispatch]);

  const handleCancelRequest = (bookingId) => {
    setCancelTarget(bookingId);
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await api.delete(`/bookings/${cancelTarget}`);
      dispatch(moveBookingToPast(cancelTarget));
      toast.success('Booking cancelled successfully');
    } catch {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelTarget(null);
    }
  };

  const currentList = activeTab === 'my' ? myBookings : pastBookings;

  return (
    <div className="flex flex-col min-h-screen bg-page-bg">
      <div className="flex-1">
        {/* Header */}
        <div className="px-4 pt-6 pb-4">
          <button id="back-btn" onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-900 text-sm font-medium">
            <HiArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-4 mb-6">
          <button
            id="my-bookings-tab"
            onClick={() => setActiveTab('my')}
            className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'my'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400'
              }`}
          >
            My Bookings
          </button>
          <button
            id="past-bookings-tab"
            onClick={() => setActiveTab('past')}
            className={`text-sm font-semibold pb-1 transition-colors ${activeTab === 'past'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400'
              }`}
          >
            Past Bookings
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-400 text-sm">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentList.map((booking) => (
                <BookingTicketCard
                  key={booking._id}
                  booking={booking}
                  showCancel={activeTab === 'my'}
                  onCancel={handleCancelRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />

      {/* Cancel confirmation modal */}
      <CancelModal
        isOpen={!!cancelTarget}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default MyBookingsPage;

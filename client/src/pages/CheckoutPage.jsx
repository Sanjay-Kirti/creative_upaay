import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentBooking } from '../store/bookingSlice';
import { addBooking } from '../store/bookingsHistorySlice';
import ProgressBar from '../components/ProgressBar';
import BottomNav from '../components/BottomNav';
import api from '../utils/api';
import { HiArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedMovie } = useSelector((state) => state.movie);
  const { selectedTheatre, selectedDate } = useSelector((state) => state.theatre);
  const { selectedFormat, selectedScreen, selectedTime, pricePerTicket } = useSelector((state) => state.schedule);
  const { selectedSeats, screeningId } = useSelector((state) => state.seat);
  const { bookingFee } = useSelector((state) => state.booking);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const ticketTotal = selectedSeats.length * pricePerTicket;
  const grandTotal = ticketTotal + bookingFee;

  const validateCard = () => {
    if (!cardData.name.trim()) { toast.error('Please enter name on card'); return false; }
    const digits = cardData.number.replace(/\s/g, '');
    if (digits.length !== 16 || !/^\d+$/.test(digits)) { toast.error('Card number must be 16 digits'); return false; }
    const [mm, yy] = cardData.expiry.split('/');
    if (!mm || !yy || parseInt(mm) < 1 || parseInt(mm) > 12) { toast.error('Invalid expiry (MM/YY)'); return false; }
    if (new Date(2000 + parseInt(yy), parseInt(mm)) <= new Date()) { toast.error('Card expired'); return false; }
    if (!/^\d{3,4}$/.test(cardData.cvc)) { toast.error('CVC must be 3-4 digits'); return false; }
    return true;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCard()) return;
    setLoading(true);

    // Simulate payment gateway — 80% success rate
    if (Math.random() >= 0.8) {
      setLoading(false);
      toast.error('Payment declined by bank. Please try again.');
      return;
    }

    try {
      // Single ACID transaction: reserves seats + creates booking atomically
      // If anything fails, seats are automatically rolled back
      const { data } = await api.post('/bookings', {
        movieId: selectedMovie._id, theatreId: selectedTheatre._id,
        screeningId, screen: selectedScreen, date: selectedDate,
        time: selectedTime, format: selectedFormat, seats: selectedSeats,
        pricePerTicket, bookingFee, totalAmount: grandTotal
      });
      dispatch(setCurrentBooking(data));
      dispatch(addBooking(data));
      navigate('/payment-success');
    } catch (error) {
      const code = error.response?.data?.code;
      if (code === 'SEATS_UNAVAILABLE') {
        toast.error('Some seats were taken by another user. Please go back and select different seats.');
      } else {
        toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5]">
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-900 text-sm font-medium">
            <HiArrowLeft className="w-5 h-5" /> Back
          </button>
          <button onClick={() => navigate('/home')} className="text-gray-400 text-sm">Cancel</button>
        </div>

        {/* Progress bar */}
        <div className="px-4 mb-8">
          <ProgressBar percent={100} />
        </div>

        {/* Title */}
        <div className="px-4 mb-8">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
        </div>

        {/* Summary */}
        <div className="px-4 mb-8">
          <h3 className="font-bold text-gray-900 mb-5">Summary</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>{selectedSeats.length}x Tickets</span>
            <span className="text-gray-800">₹{ticketTotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-5">
            <span>Booking Fee</span>
            <span className="text-gray-800">₹{bookingFee}</span>
          </div>
          <div className="border-t border-gray-300 pt-4 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">₹{grandTotal}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="px-4 mb-8">
          <h3 className="font-bold text-gray-900 mb-6">Choose payment method</h3>
          <div className="flex items-center gap-8 mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payment" checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-gray-700">Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="payment" checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')} className="w-5 h-5 accent-indigo-600" />
              <span className="text-sm text-gray-700">Mobile Wallet</span>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Name on card</label>
                <input type="text" placeholder="Name on card" value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-indigo-300 focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Card number</label>
                <input type="text" placeholder="1234 5678 9012 3456" value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:border-indigo-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Expiry date</label>
                  <input type="text" placeholder="MM/YY" value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">CVC/CVV</label>
                  <input type="text" placeholder="CVC" value={cardData.cvc}
                    onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-300 focus:outline-none focus:border-indigo-400" />
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded" />
                  <span className="text-sm text-gray-400">Save payment details for the next purchase</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Spacer pushes button to bottom */}
        <div className="flex-1" />

        {/* Button pinned to bottom */}
        <div className="px-4 mb-6">
          <button onClick={handlePayment} disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-base">
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CheckoutPage;
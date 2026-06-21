import { useDispatch, useSelector } from 'react-redux';
import { setCurrentBooking, clearCurrentBooking } from '../store/bookingSlice';
import { addBooking } from '../store/bookingsHistorySlice';
import { clearSeats } from '../store/seatSlice';
import { clearSchedule } from '../store/scheduleSlice';
import { clearTheatre } from '../store/theatreSlice';
import { clearSelectedMovie } from '../store/movieSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useBooking = () => {
  const dispatch = useDispatch();
  const { currentBooking, bookingFee } = useSelector((state) => state.booking);

  const createBooking = async (bookingData) => {
    try {
      const { data } = await api.post('/bookings', bookingData);
      dispatch(setCurrentBooking(data));
      dispatch(addBooking(data));
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
      throw error;
    }
  };

  const clearBookingFlow = () => {
    dispatch(clearCurrentBooking());
    dispatch(clearSeats());
    dispatch(clearSchedule());
    dispatch(clearTheatre());
    dispatch(clearSelectedMovie());
  };

  return {
    currentBooking,
    bookingFee,
    createBooking,
    clearBookingFlow
  };
};

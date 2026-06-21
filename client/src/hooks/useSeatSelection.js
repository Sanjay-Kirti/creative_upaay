import { useDispatch, useSelector } from 'react-redux';
import { toggleSeat, setSeatMap, setScreeningId, clearSeats } from '../store/seatSlice';
import toast from 'react-hot-toast';

export const useSeatSelection = () => {
  const dispatch = useDispatch();
  const { seatMap, selectedSeats, totalPrice, maxSeats, screeningId } = useSelector((state) => state.seat);
  const { pricePerTicket } = useSelector((state) => state.schedule);

  const handleSeatClick = (seatId) => {
    if (seatMap[seatId] === 'occupied') return;

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= maxSeats) {
      toast.error(`Maximum ${maxSeats} seats allowed`);
      return;
    }

    dispatch(toggleSeat({ seatId, pricePerTicket }));
  };

  const initSeatMap = (map, id) => {
    dispatch(setSeatMap(map));
    dispatch(setScreeningId(id));
  };

  const resetSeats = () => {
    dispatch(clearSeats());
  };

  return {
    seatMap,
    selectedSeats,
    totalPrice,
    maxSeats,
    screeningId,
    handleSeatClick,
    initSeatMap,
    resetSeats
  };
};

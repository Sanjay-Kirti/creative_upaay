import { createSlice } from '@reduxjs/toolkit';

const seatSlice = createSlice({
  name: 'seat',
  initialState: {
    seatMap: {},
    selectedSeats: [],
    totalPrice: 0,
    maxSeats: 6,
    screeningId: null
  },
  reducers: {
    setSeatMap: (state, action) => {
      state.seatMap = action.payload;
    },
    setScreeningId: (state, action) => {
      state.screeningId = action.payload;
    },
    toggleSeat: (state, action) => {
      const seatId = action.payload.seatId;
      const pricePerTicket = action.payload.pricePerTicket;

      if (state.seatMap[seatId] === 'occupied') return;

      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter(s => s !== seatId);
        state.seatMap[seatId] = 'available';
      } else {
        if (state.selectedSeats.length >= state.maxSeats) return;
        state.selectedSeats.push(seatId);
        state.seatMap[seatId] = 'selected';
      }
      state.totalPrice = state.selectedSeats.length * pricePerTicket;
    },
    clearSeats: (state) => {
      state.seatMap = {};
      state.selectedSeats = [];
      state.totalPrice = 0;
      state.screeningId = null;
    }
  }
});

export const { setSeatMap, setScreeningId, toggleSeat, clearSeats } = seatSlice.actions;
export default seatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const bookingsHistorySlice = createSlice({
  name: 'bookingsHistory',
  initialState: {
    myBookings: [],
    pastBookings: []
  },
  reducers: {
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    setPastBookings: (state, action) => {
      state.pastBookings = action.payload;
    },
    moveBookingToPast: (state, action) => {
      const bookingId = action.payload;
      const booking = state.myBookings.find(b => b._id === bookingId);
      if (booking) {
        state.myBookings = state.myBookings.filter(b => b._id !== bookingId);
        state.pastBookings.unshift({ ...booking, status: 'cancelled' });
      }
    },
    addBooking: (state, action) => {
      state.myBookings.unshift(action.payload);
    }
  }
});

export const { setMyBookings, setPastBookings, moveBookingToPast, addBooking } = bookingsHistorySlice.actions;
export default bookingsHistorySlice.reducer;

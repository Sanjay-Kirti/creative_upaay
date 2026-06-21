import { createSlice } from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    selectedFormat: '2D',
    selectedScreen: null,
    selectedTime: null,
    pricePerTicket: 0
  },
  reducers: {
    setSelectedFormat: (state, action) => {
      state.selectedFormat = action.payload;
    },
    setSelectedScreen: (state, action) => {
      state.selectedScreen = action.payload;
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setPricePerTicket: (state, action) => {
      state.pricePerTicket = action.payload;
    },
    clearSchedule: (state) => {
      state.selectedFormat = '2D';
      state.selectedScreen = null;
      state.selectedTime = null;
      state.pricePerTicket = 0;
    }
  }
});

export const { setSelectedFormat, setSelectedScreen, setSelectedTime, setPricePerTicket, clearSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const theatreSlice = createSlice({
  name: 'theatre',
  initialState: {
    selectedTheatre: null,
    selectedDate: null
  },
  reducers: {
    setSelectedTheatre: (state, action) => {
      state.selectedTheatre = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    clearTheatre: (state) => {
      state.selectedTheatre = null;
      state.selectedDate = null;
    }
  }
});

export const { setSelectedTheatre, setSelectedDate, clearTheatre } = theatreSlice.actions;
export default theatreSlice.reducer;

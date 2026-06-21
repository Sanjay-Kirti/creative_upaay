import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    selectedMovie: null
  },
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    }
  }
});

export const { setSelectedMovie, clearSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;

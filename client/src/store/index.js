import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem: (key) => {
    return Promise.resolve(localStorage.removeItem(key));
  }
};

import authReducer from './authSlice';
import movieReducer from './movieSlice';
import theatreReducer from './theatreSlice';
import scheduleReducer from './scheduleSlice';
import seatReducer from './seatSlice';
import bookingReducer from './bookingSlice';
import bookingsHistoryReducer from './bookingsHistorySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
  theatre: theatreReducer,
  schedule: scheduleReducer,
  seat: seatReducer,
  booking: bookingReducer,
  bookingsHistory: bookingsHistoryReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'movie', 'theatre', 'schedule', 'seat', 'booking', 'bookingsHistory']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);

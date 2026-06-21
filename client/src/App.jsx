import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './store';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SelectTheatrePage from './pages/SelectTheatrePage';
import SchedulePage from './pages/SchedulePage';
import SeatsPage from './pages/SeatsPage';
import BookingSummaryPage from './pages/BookingSummaryPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailsPage /></ProtectedRoute>} />
      <Route path="/select-theatre/:movieId" element={<ProtectedRoute><SelectTheatrePage /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
      <Route path="/seats" element={<ProtectedRoute><SeatsPage /></ProtectedRoute>} />
      <Route path="/booking-summary" element={<ProtectedRoute><BookingSummaryPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><div className="min-h-screen bg-page-bg pb-20 flex items-center justify-center text-gray-400">Favorites coming soon</div></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><div className="min-h-screen bg-page-bg pb-20 flex items-center justify-center text-gray-400">Profile coming soon</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="max-w-[390px] mx-auto bg-[#F0F2F5] min-h-screen relative shadow-xl">
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  fontSize: '14px'
                }
              }}
            />
            <AppRoutes />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;

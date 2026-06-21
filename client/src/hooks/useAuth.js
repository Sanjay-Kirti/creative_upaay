import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, logout } from '../store/authSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Login successful!');
      navigate('/home');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Account created successfully!');
      navigate('/home');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed');
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { user, token, isAuthenticated, login, signup, logout: handleLogout };
};

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { logout, setCredentials } from '../store/authSlice';
import { authAPI } from '../api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password }) as any;
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authAPI.register({ username, email, password });
      navigate('/login');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    token,
    login,
    register,
    logout: logoutUser,
  };
};
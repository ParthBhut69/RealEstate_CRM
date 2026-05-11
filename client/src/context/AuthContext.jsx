import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('brokerflow_token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data.user);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('brokerflow_token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.requires2FA) {
        return { requires2FA: true, email: response.data.email };
      }
      const { token, user } = response.data;
      localStorage.setItem('brokerflow_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      const { token, user } = response.data;
      localStorage.setItem('brokerflow_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('OTP verification failed', error);
      return { success: false, message: error.response?.data?.message || 'Invalid code' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password failed', error);
      return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      return { success: true };
    } catch (error) {
      console.error('Reset password failed', error);
      return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
    }
  };

  const register = async ({ name, email, password, role, phone }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role, phone });
      const { token, user } = response.data;
      localStorage.setItem('brokerflow_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('brokerflow_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = async (formDataOrData) => {
    try {
      const isFormData = formDataOrData instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await axios.put(`${API_URL}/users/profile`, formDataOrData, config);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error('Update profile failed', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, forgotPassword, resetPassword, register, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

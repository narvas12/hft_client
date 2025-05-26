import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

const AuthService = {

  async login(credentials) {
    try {
      const response = await axiosInstance.post(API.AUTH_MANAGEMENT.LOGIN, credentials);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },


  async register(userData) {
    try {
      const response = await axiosInstance.post(API.AUTH_MANAGEMENT.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  async getAuthenticatedUser() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axiosInstance.get(API.AUTH_MANAGEMENT.USER_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;
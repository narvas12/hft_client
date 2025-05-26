import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

const createDcaBot = async (botData) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.CREATE_BOT, botData);
    return response.data;
  } catch (error) {
    // Throw error for the caller to handle
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

export default {
  createDcaBot,
};

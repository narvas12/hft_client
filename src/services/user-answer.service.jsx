import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

const UserAnswerService = {
  getUserAnswers: async () => {
    try {
      const response = await axiosInstance.get(API.QUESTION_MANAGEMENT.USER_ANSWERS.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching user answers:', error);
      throw error;
    }
  },

  getUserAnswerDetail: async (id) => {
    try {
      const response = await axiosInstance.get(API.QUESTION_MANAGEMENT.USER_ANSWERS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching user answer ${id}:`, error);
      throw error;
    }
  }
};

export default UserAnswerService;
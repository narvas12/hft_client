import axiosInstance from "../../utils/axiosConfig";
import { API } from "../api/apiEndpoints";

const TestService = {
  submitTest: async (answers) => {
    try {
      const response = await axiosInstance.post(API.TEST_MANAGEMENT.START_TEST, answers);
      return response.data;
    } catch (error) {
      console.error("Error submitting test:", error);
      throw error;
    }
  },
};

export default TestService;

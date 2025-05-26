import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

const QuestionService = {
  getQuestions: async () => {
    try {
      const response = await axiosInstance.get(API.QUESTION_MANAGEMENT.QUESTIONS.LIST);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  getQuestionDetail: async (id) => {
    try {
      const response = await axiosInstance.get(API.QUESTION_MANAGEMENT.QUESTIONS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${id}:`, error);
      throw error;
    }
  },

  uploadPdfQuestions: async (file, subject) => {
    try {
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('subject', subject);
      
      const response = await axiosInstance.post(
        API.QUESTION_MANAGEMENT.PDF_UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }
};

export default QuestionService;
import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

// Create Exchange Account
export const addExchangeAccount = async (payload) => {
  try {
    const response = await axiosInstance.post(API.ACCOUNT_MANAGEMENT.ADD_EXCHANGE, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get Account Details
export const getExchangeDetails = async (accountId) => {
  try {
    const response = await axiosInstance.get(API.ACCOUNT_MANAGEMENT.EXCHANGE_DETAILS(accountId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get All Accounts List
export const getAllAccounts = async () => {
  try {
    const response = await axiosInstance.get(API.ACCOUNT_MANAGEMENT.ACCOUNTS_LIST);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

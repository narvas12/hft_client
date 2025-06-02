import axiosInstance from '../../utils/axiosConfig';
import { API } from '../api/apiEndpoints';

const createDcaBot = async (botData) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.CREATE_BOT, botData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const getDcaBot = async (botId) => {
  try {
    const response = await axiosInstance.get(API.HFT_BOT.GET_BOT(botId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const listDcaBots = async (queryParams = {}) => {
  try {
    const response = await axiosInstance.get(API.HFT_BOT.LIST_BOTS, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const getStrategyList = async (queryParams = {}) => {
  try {
    const response = await axiosInstance.get(API.HFT_BOT.GET_STRATEGY_LIST, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const enableDcaBot = async (botId) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.ENABLE_BOT(botId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const disableDcaBot = async (botId) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.DISABLE_BOT(botId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const deleteDcaBot = async (botId) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.DELETE_BOT(botId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

const updateDcaBot = async (botId, botData) => {
  try {
    const response = await axiosInstance.post(API.HFT_BOT.UPDATE_BOT(botId), botData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Unknown error occurred';
  }
};

export default {
  createDcaBot,
  getDcaBot,
  listDcaBots,
  getStrategyList,
  enableDcaBot,
  disableDcaBot,
  deleteDcaBot,
  updateDcaBot,
};

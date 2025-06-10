import axiosInstance from "../utils/axiosConfig";
import { API } from "../constants/endpoints";

const handleError = (error) => {
  if (error.response) {

    throw {
      status: error.response.status,
      message: error.response.data?.message || "An error occurred.",
      data: error.response.data,
    };
  } else if (error.request) {

    throw {
      status: null,
      message: "No response from server.",
    };
  } else {

    throw {
      status: null,
      message: error.message || "Unexpected error occurred.",
    };
  }
};

const GridBotService = {
  createGridBot: async (payload) => {
    try {
      const response = await axiosInstance.post(API.GRID_BOT_MANAGEMENT.CREATE, payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateGridBot: async (botId, payload) => {
    try {
      const response = await axiosInstance.patch(API.GRID_BOT_MANAGEMENT.UPDATE(botId), payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getGridBot: async (botId) => {
    try {
      const response = await axiosInstance.get(API.GRID_BOT_MANAGEMENT.GET_ONE(botId));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  listGridBots: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API.GRID_BOT_MANAGEMENT.LIST, { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getProfits: async (botId, from, to) => {
    try {
      const response = await axiosInstance.get(API.GRID_BOT_MANAGEMENT.PROFITS(botId), {
        params: { from, to },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  enableGridBot: async (botId) => {
    try {
      const response = await axiosInstance.post(API.GRID_BOT_MANAGEMENT.ENABLE(botId));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  disableGridBot: async (botId) => {
    try {
      const response = await axiosInstance.post(API.GRID_BOT_MANAGEMENT.DISABLE(botId));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteGridBot: async (botId) => {
    try {
      const response = await axiosInstance.delete(API.GRID_BOT_MANAGEMENT.DELETE(botId));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getRequiredBalances: async (botId) => {
    try {
      const response = await axiosInstance.get(API.GRID_BOT_MANAGEMENT.REQUIRED_BALANCES(botId));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getEvents: async (botId, page = 1, perPage = 100) => {
    try {
      const url = API.GRID_BOT_MANAGEMENT.EVENTS(botId, page, perPage);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getMarketOrders: async (botId, limit = 100, offset = 0) => {
    try {
      const url = API.GRID_BOT_MANAGEMENT.MARKET_ORDERS(botId, limit, offset);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default GridBotService;

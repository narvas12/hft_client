export const API = {
  AUTH_MANAGEMENT: {
    LOGIN: "/login/",
    USER_PROFILE: "/users/me/",
  },

  HFT_BOT: {
    CREATE_BOT: "/create-dca-bot/",
    GET_BOT: (botId) => `/get-dca-bot/${botId}`,
    LIST_BOTS: "/list-dca-bots/",
    GET_STRATEGY_LIST: "/get-strategy-list/",
    ENABLE_BOT: (botId) => `/enable-dca-bot/${botId}`,
    DISABLE_BOT: (botId) => `/disable-dca-bot/${botId}`,
    DELETE_BOT: (botId) => `/delete-dca-bot/${botId}`,
    UPDATE_BOT: (botId) => `/update-dca-bot/${botId}`,
  },

  GRID_BOT_MANAGEMENT: {
    CREATE: "/create-grid-bot/",
    UPDATE: (botId) => `/${botId}/manual`,
    GET_ONE: (botId) => `/grid-bots/${botId}`,
    LIST: "/grid-bots",
    PROFITS: (botId) => `/grid-bots/${botId}/profits`,
    ENABLE: (botId) => `/grid-bots/${botId}/enable`,
    DISABLE: (botId) => `/grid-bots/${botId}/disable`,
    DELETE: (botId) => `/grid-bots/${botId}`,
    REQUIRED_BALANCES: (botId) => `/grid-bots/${botId}/required-balances`,
    EVENTS: (botId, page = 1, perPage = 100) =>
      `/grid-bots/${botId}/events?page=${page}&per_page=${perPage}`,
    MARKET_ORDERS: (botId, limit = 100, offset = 0) =>
      `/grid-bots/${botId}/market-orders?limit=${limit}&offset=${offset}`,
  },

  ACCOUNT_MANAGEMENT: {
    ADD_EXCHANGE: "/add-exchange-account/",
    EXCHANGE_DETAILS: (account_id) => `/account/details/${account_id}`,
    ACCOUNTS_LIST: "/account/list/",
  },
};

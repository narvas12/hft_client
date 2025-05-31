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
  },
};

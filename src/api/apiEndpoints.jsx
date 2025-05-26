export const API = {
  AUTH_MANAGEMENT: {
    LOGIN: "/login/",
    USER_PROFILE: "/users/me/",
  },
  QUESTION_MANAGEMENT: {
    QUESTIONS: {
      LIST: "/questions/",
      DETAIL: (pk) => `/questions/${pk}/`,
    },
    PDF_UPLOAD: "/questions/upload_pdf/",
    USER_ANSWERS: {
      LIST: "/user-answers/",
      DETAIL: (pk) => `/user-answers/${pk}/`,
    },
  },
  TEST_MANAGEMENT: {
    START_TEST: "/anonymous-test/",
    
  },

  HFT_BOT: {
    CREATE_BOT: "/create-dca-bot/",
  },
};

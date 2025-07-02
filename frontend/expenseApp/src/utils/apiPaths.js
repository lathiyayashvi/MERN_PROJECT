export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// utils/apiPath.js
export const API_PATHS = {
    AUTH: {
        LOGIN: `/api/v1/auth/login`,
        REGISTER: `/api/v1/auth/register`,
        GET_USER_INFO: `/api/v1/auth/getUser`,
        SEND_RESET_OTP: `/api/v1/auth/send-reset-otp`,
        VERIFY_EMAIL_OTP_SEND: `/api/v1/auth/send-verify-otp`,
        VERIFY_ACCOUNT: `/api/v1/auth/verify-account`,
        SEND_RESET_PASSWORD: `/api/v1/auth/reset-pass`,
        EDIT_PROFILE: `/api/v1/auth/edit-profile`,
        GOOGLE_LOGIN: `/api/v1/auth/google`
    },
    DASHBOARD: {
        GET_DATA: `/api/v1/dashboard`,
    },
    INCOME: {
        ADD_INCOME: `/api/v1/income/add`,
        GET_ALL_INCOME: `/api/v1/income/get`,
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: `/api/v1/income/downloadexcel`,
    },
    EXPENSE: {
        ADD_EXPENSE: `/api/v1/expense/add`,
        GET_ALL_EXPENSE: `/api/v1/expense/get`,
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexcel`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/api/v1/auth/upload-image`,
    },
};
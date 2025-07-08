let BASE_URL;

if (import.meta.env.MODE === "development") {
  BASE_URL = import.meta.env.VITE_API_BASE_URL_DEV;
} else {
  BASE_URL = import.meta.env.VITE_API_BASE_URL_PROD;
}

export const USER_API_END_POINT = `${BASE_URL}/api/user`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/company`;
export const JOB_API_END_POINT = `${BASE_URL}/api/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/application`;
export const MESSAGE_API_END_POINT = `${BASE_URL}/api/message`;

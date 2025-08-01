import axios from "axios";
import Cookies from "js-cookie";

interface CommonParams {
  userId?: string;
  dominio?: string;
  compressed: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: string;
}

const getCommonParams = (): CommonParams => {
  return {
    userId: Cookies.get("userId"),
    dominio: Cookies.get("dominio"),
    compressed: false,
  };
};

let baseURL = "https://apigerp.erp.avanzadi.com/api/";
if (window.location.hostname === "localhost") {
  baseURL = "https://localhost:7027/api/";
}

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: any): any => {
    const token = Cookies.get("authToken");
    const commonParams = getCommonParams();
    const method = (config.method || "get").toLowerCase();

    if (method === "get" || method === "delete") {
      config.params = {
        ...(config.params || {}),
        ...commonParams,
      };
    } else {
      config.data = {
        ...(config.data || {}),
        ...commonParams,
      };
    }

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      Cookies.remove("authToken");
      Cookies.remove("userId");
      Cookies.remove("dominio");
      Cookies.remove("semilla");
      Cookies.remove("NombreCompleto");
      window.location.href = "/";
    } else if (status === 500) {
      console.error("Error 500 - Servidor interno");
    }

    return Promise.reject(error);
  }
);

export { getCommonParams };
export default apiClient;

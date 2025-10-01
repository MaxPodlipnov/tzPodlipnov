import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.skilla.ru/mango/getList",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer testtoken`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;

    if (error.response?.status === 403 && !prevRequest) {
      try {
        const { data } = await axiosInstance.get("/auth/refreshTokens");

        prevRequest.sent = true;
        prevRequest.headers.authorization = `Bearer ${data.data.accessToken}`;

        return axiosInstance(prevRequest);
      } catch (error) {
        window.location.href = "/auth";
        return Promise.reject(error);
      }
    }
  }
);

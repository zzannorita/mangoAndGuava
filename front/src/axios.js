import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response, // 성공의 경우 그대로 결과 반환하는거
  async (error) => {
    console.log(error);
    const originalRequest = error.config; // 기존 요청 정보

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry // 재시도 플래그 추가로 무한 루프 방지
    ) {
      originalRequest._retry = true; // 재시도 여부 설정

      try {
        const userId = Cookies.get("userId");
        if (!userId) {
          throw new Error("User ID not found in cookies.");
        }

        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const response = await axios.post(
          "http://localhost:3001/refresh-token",
          { userId }
        );
        const newAccessToken = response.data.accessToken;

        Cookies.set("accessToken", newAccessToken);

        // 기존 요청 헤더에 새로운 토큰 설정
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 기존 요청 재시도
        return axiosInstance(originalRequest);
      } catch (error) {
        console.error("토큰 재발급 실패:", error);
        // 재발급 실패 시 로그아웃 또는 사용자 알림 처리
        return Promise.reject(error);
      }
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default axiosInstance;

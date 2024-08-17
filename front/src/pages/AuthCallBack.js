import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");

      if (code) {
        try {
          // 백엔드로 카카오 로그인 코드 보내기
          const response = await axios.get(
            `http://localhost:3001/auth/kakao/callback`,
            {
              params: {
                code: code,
              },
            }
          );

          const { status } = response.data;
          console.log(response.data);
          if (status === "NEW_MEMBER") {
            navigate("/newMember");
          } else if (status === "EXISTING_MEMBER") {
            navigate("/");
          }
        } catch (error) {
          console.error("로그인 오류:", error);
        }
      }
    };

    fetchLoginStatus();
  }, [navigate]);

  return <div>로그인 중...</div>;
}

export default AuthCallback;

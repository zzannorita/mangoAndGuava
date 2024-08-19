import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoginStatus = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");

      try {
        if (code === "NEW_MEMBER") {
          navigate("/newMember");
        } else if (code === "EXISTING_MEMBER") {
          navigate("/");
        }
      } catch (error) {
        console.error("로그인 오류:", error);
        // }
      }
    };

    fetchLoginStatus();
  }, [navigate]);

  return <div>로그인 중...</div>;
}

export default AuthCallback;

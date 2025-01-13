import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSearch = () => {
  const [query, setQuery] = useState(""); // 입력 중인 검색어
  const [submitQuery, setSubmitQuery] = useState(""); // 최종 전송된 검색어
  const navigate = useNavigate();

  const onChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSearch = () => {
    if (query.trim()) {
      setSubmitQuery(query); // 입력 값을 최종 전송 상태로 저장
      navigate(`/products?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
  };

  return { query, submitQuery, onChange, handleSearch };
};

export default useSearch;

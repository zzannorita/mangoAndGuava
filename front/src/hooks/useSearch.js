// src/hooks/useSearch.js
import { useState } from "react";

const useSearch = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    console.log("검색어:", query);
    // 여기에서 검색 로직을 추가 API 호출 등
  };

  const onChange = (event) => {
    setQuery(event.target.value);
  };

  return { query, onChange, handleSearch };
};

export default useSearch;

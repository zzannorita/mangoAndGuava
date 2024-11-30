import React from "react";
import useSearch from "../hooks/useSearch";
import SearchBoxStyle from "../styles/searchBox.module.css";
import search from "../image/search.png";
const SearchBox = () => {
  const { query, onChange, handleSearch } = useSearch();

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // 엔터 키 입력 시 검색 실행
    }
  };
  return (
    <div className={SearchBoxStyle.searchContainer}>
      <input
        type="text"
        className="searchBox"
        value={query}
        onChange={onChange}
        onKeyDown={handleEnter}
        placeholder="찾으시는 상품을 검색하세요."
      />
      <button className={SearchBoxStyle.searchButton} onClick={handleSearch}>
        <img className={SearchBoxStyle.searchImg} alt="search" src={search} />
      </button>
    </div>
  );
};

export default SearchBox;

import { Link } from "react-router-dom";
import React, { useState } from "react";
import CategoryStyle from "../styles/category.module.css";
import categoryImg from "../image/category.png";
import greaterImg from "../image/greater.png";

export default function Category() {
  ///////////////////카테고리 hover시////////////////////
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [hoveredSubSubCategory, setHoveredSubSubCategory] = useState(null);

  //첫번째 카테고리 hover시
  const handleMouseHover = (category) => {
    setHoveredCategory(category);
    setHoveredSubSubCategory(null);
  };

  //카테고리 중복 뜸 방지
  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setHoveredSubCategory(null);
    setHoveredSubSubCategory(null);
  };

  //두번째 카테고리 hover시
  const handleSubMouseHover = (subCategory) => {
    setHoveredSubCategory(subCategory);
    setHoveredSubSubCategory(null);
  };

  const handleSubSubMouseHover = (subSubCategory) => {
    setHoveredSubSubCategory(subSubCategory);
  };

  const categories = [
    { code: 100, name: "의류" },
    { code: 200, name: "가전제품" },
    { code: 300, name: "주방용품" },
    { code: 400, name: "자동차용품" },
    { code: 100110, name: "남성의류" },
    { code: 100120, name: "여성의류" },
    { code: 100130, name: "아동의류" },
    { code: 100110111, name: "상의" },
    { code: 100110112, name: "하의" },
    { code: 100110113, name: "운동화" },
  ];

  return (
    <div className={CategoryStyle.categoryBox}>
      <img
        className={CategoryStyle.categoryImg}
        alt="categoryImg"
        src={categoryImg}
      />
      <div className={CategoryStyle.selectedCategoryBox}>
        <div
          className={`${CategoryStyle.selectedCategory} ${
            CategoryStyle.selectedCategory1
          } ${hoveredCategory ? CategoryStyle.visible : ""}`}
        >
          {hoveredCategory || ""}
        </div>
        <img
          className={`${CategoryStyle.greaterImg} ${
            CategoryStyle.greaterImg1
          } ${hoveredSubCategory ? CategoryStyle.visible : ""}`}
          alt="greaterImg"
          src={greaterImg}
        />
        <div
          className={`${CategoryStyle.selectedCategory} ${
            CategoryStyle.selectedCategory2
          } ${hoveredSubCategory ? CategoryStyle.visible : ""}`}
        >
          {hoveredSubCategory || ""}
        </div>
        <img
          className={`${CategoryStyle.greaterImg} ${
            CategoryStyle.greaterImg2
          } ${hoveredSubSubCategory ? CategoryStyle.visible : ""}`}
          alt="greaterImg"
          src={greaterImg}
        />
        <div
          className={`${CategoryStyle.selectedCategory} ${
            CategoryStyle.selectedCategory3
          } ${hoveredSubSubCategory ? CategoryStyle.visible : ""}`}
        >
          {hoveredSubSubCategory || ""}
        </div>
      </div>
      <div className={CategoryStyle.navbar}>
        <ul>
          <li
            onMouseEnter={() => handleMouseHover("의류")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/search?category?category={100}">의류</Link>
            {hoveredCategory === "의류" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("남성의류")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=100110">남성의류</Link>
                    {hoveredSubCategory === "남성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("상의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?category?category=100110111">
                              상의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("하의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100110112">
                              하의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("운동화")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100110113">
                              운동화
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <Link to="/search?productCategory=100120">여성의류</Link>
                  </li>
                  <li>
                    <Link to="/search?productCategory=100130">아동의류</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link to="/electronic">가전제품</Link>
          </li>
          <li>
            <Link to="/kitchen">주방용품</Link>
          </li>
          <li>
            <Link to="/car">자동차용품</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

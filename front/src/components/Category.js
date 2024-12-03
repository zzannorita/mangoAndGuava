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
            <Link to="/search?productCategory=100">의류</Link>
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
                            <Link to="/search?productCategory=100110111">
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
                  <li
                    onMouseEnter={() => handleSubMouseHover("여성의류")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=100120">여성의류</Link>
                    {hoveredSubCategory === "여성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("상의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100120111">
                              상의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("하의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100120112">
                              하의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("신발")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100120113">
                              신발
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("아동의류")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=100130">아동의류</Link>
                    {hoveredSubCategory === "아동의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("상의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100130111">
                              상의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("하의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link to="/search?productCategory=100130112">
                              하의
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() => handleMouseHover("가전제품")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/search?productCategory=200">가전제품</Link>
            {hoveredCategory === "가전제품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("냉장고")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=200110">냉장고</Link>
                    {hoveredSubCategory === "냉장고" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=200110111">
                              1인용 냉장고
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=200110112">
                              대형 냉장고
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("세탁기")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=200120">세탁기</Link>
                    {hoveredSubCategory === "세탁기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=200120111">
                              드럼 세탁기
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=200120112">
                              통돌이 세탁기
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("에어컨")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=200130">에어컨</Link>
                    {hoveredSubCategory === "에어컨" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=200130111">
                              벽걸이형
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=200130112">
                              스탠드형
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("TV")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=200140">TV</Link>
                    {hoveredSubCategory === "TV" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=200140111">
                              스마트 TV
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=200140112">
                              UHD TV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li
            onMouseEnter={() => handleMouseHover("주방용품")}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/search?productCategory=300">주방용품</Link>
            {hoveredCategory === "주방용품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("식기류")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=300110">식기류</Link>
                    {hoveredSubCategory === "식기류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=300110111">
                              접시
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=300110112">
                              컵
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("조리도구")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=300120">조리도구</Link>
                    {hoveredSubCategory === "조리도구" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=300120111">
                              칼
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=300120112">
                              국자
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("전자레인지")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/search?productCategory=300130">전자레인지</Link>
                    {hoveredSubCategory === "전자레인지" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link to="/search?productCategory=300130111">
                              일반 전자레인지
                            </Link>
                          </li>
                          <li>
                            <Link to="/search?productCategory=300130112">
                              조리기능 전자레인지
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

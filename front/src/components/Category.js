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

  // 상태 초기화 함수
  const resetHoverState = () => {
    setHoveredCategory(null);
    setHoveredSubCategory(null);
    setHoveredSubSubCategory(null);
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
            <Link
              to="/products?category=100"
              onClick={resetHoverState}
              className={CategoryStyle.clickSize}
            >
              의류
            </Link>
            {hoveredCategory === "의류" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("남성의류")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=100110"
                      onClick={resetHoverState}
                    >
                      남성의류
                    </Link>
                    {hoveredSubCategory === "남성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("상의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100110111"
                              onClick={resetHoverState}
                            >
                              상의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("하의")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100110112"
                              onClick={resetHoverState}
                            >
                              하의
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("운동화")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100110113"
                              onClick={resetHoverState}
                            >
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
                    <Link
                      to="/products?category=100120"
                      onClick={resetHoverState}
                    >
                      여성의류
                    </Link>
                    {hoveredSubCategory === "여성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("원피스")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100120121"
                              onClick={resetHoverState}
                            >
                              원피스
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("스커트")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100120122"
                              onClick={resetHoverState}
                            >
                              스커트
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("하이힐")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100120123"
                              onClick={resetHoverState}
                            >
                              하이힐
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
                    <Link
                      to="/products?category=100130"
                      onClick={resetHoverState}
                    >
                      아동의류
                    </Link>
                    {hoveredSubCategory === "아동의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("티셔츠")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100130131"
                              onClick={resetHoverState}
                            >
                              티셔츠
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("바지")}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100130132"
                              onClick={resetHoverState}
                            >
                              바지
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("운동화")
                            }
                            onMouseLeave={handleMouseLeave}
                          >
                            <Link
                              to="/products?category=100130133"
                              onClick={resetHoverState}
                            >
                              운동화
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
            <Link to="/products?category=200" onClick={resetHoverState}>
              가전제품
            </Link>
            {hoveredCategory === "가전제품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("TV")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=200210"
                      onClick={resetHoverState}
                    >
                      TV
                    </Link>
                    {hoveredSubCategory === "TV" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=200210211"
                              onClick={resetHoverState}
                            >
                              LED TV
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200210212"
                              onClick={resetHoverState}
                            >
                              OLED TV
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200210213"
                              onClick={resetHoverState}
                            >
                              QLED TV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("냉장고")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=200220"
                      onClick={resetHoverState}
                    >
                      냉장고
                    </Link>
                    {hoveredSubCategory === "냉장고" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=200220211"
                              onClick={resetHoverState}
                            >
                              양문형
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200220212"
                              onClick={resetHoverState}
                            >
                              미니 냉장고
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200220213"
                              onClick={resetHoverState}
                            >
                              와인 냉장고
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
                    <Link
                      to="/products?category=200230"
                      onClick={resetHoverState}
                    >
                      세탁기
                    </Link>
                    {hoveredSubCategory === "세탁기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=200230211"
                              onClick={resetHoverState}
                            >
                              드럼 세탁기
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200230212"
                              onClick={resetHoverState}
                            >
                              통돌이 세탁기
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=200230213"
                              onClick={resetHoverState}
                            >
                              미니 세탁기
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
            <Link to="/products?category=300" onClick={resetHoverState}>
              주방용품
            </Link>
            {hoveredCategory === "주방용품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li
                    onMouseEnter={() => handleSubMouseHover("냄비")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=300310"
                      onClick={resetHoverState}
                    >
                      냄비
                    </Link>
                    {hoveredSubCategory === "냄비" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=300310311"
                              onClick={resetHoverState}
                            >
                              스테인리스 냄비
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300310312"
                              onClick={resetHoverState}
                            >
                              압력솥
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300310313"
                              onClick={resetHoverState}
                            >
                              법랑 냄비
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("프라이팬")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=300320"
                      onClick={resetHoverState}
                    >
                      프라이팬
                    </Link>
                    {hoveredSubCategory === "프라이팬" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=300320311"
                              onClick={resetHoverState}
                            >
                              비철 프라이팬
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300320312"
                              onClick={resetHoverState}
                            >
                              비철 프라이팬
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300320313"
                              onClick={resetHoverState}
                            >
                              그릴 팬
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li
                    onMouseEnter={() => handleSubMouseHover("식기")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to="/products?category=300330"
                      onClick={resetHoverState}
                    >
                      식기
                    </Link>
                    {hoveredSubCategory === "식기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>
                            <Link
                              to="/products?category=300330311"
                              onClick={resetHoverState}
                            >
                              접시
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300330312"
                              onClick={resetHoverState}
                            >
                              컵
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/products?category=300330313"
                              onClick={resetHoverState}
                            >
                              수저
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

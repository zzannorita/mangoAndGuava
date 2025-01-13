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
    setHoveredSubCategory(null);
  };

  //두번째 카테고리 hover시
  const handleSubMouseHover = (subCategory) => {
    setHoveredSubCategory(subCategory);
    setHoveredSubSubCategory(null);
  };

  //세번째 카테고리 hover시
  const handleSubSubMouseHover = (subSubCategory) => {
    setHoveredSubSubCategory(subSubCategory);
  };

  return (
    <div
      className={CategoryStyle.categoryBox}
      onMouseLeave={() => {
        setHoveredCategory(null);
        setHoveredSubCategory(null);
        setHoveredSubSubCategory(null);
      }}
    >
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
          <li onMouseEnter={() => handleMouseHover("의류")}>
            <Link to="/products?category=100">의류</Link>
            {hoveredCategory === "의류" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li onMouseEnter={() => handleSubMouseHover("남성의류")}>
                    <Link to="/products?category=100110">남성의류</Link>
                    {hoveredSubCategory === "남성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("상의")}
                          >
                            <Link to="/products?category=100110111">상의</Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("하의")}
                          >
                            <Link to="/products?category=100110112">하의</Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("운동화")
                            }
                          >
                            <Link to="/products?category=100110113">
                              운동화
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("여성의류")}>
                    <Link to="/products?category=100120">여성의류</Link>
                    {hoveredSubCategory === "여성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("원피스")
                            }
                          >
                            <Link to="/products?category=100120121">
                              원피스
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("스커트")
                            }
                          >
                            <Link to="/products?category=100120122">
                              스커트
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("하이힐")
                            }
                          >
                            <Link to="/products?category=100120123">
                              하이힐
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("아동의류")}>
                    <Link to="/products?category=100130">아동의류</Link>
                    {hoveredSubCategory === "아동의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("티셔츠")
                            }
                          >
                            <Link to="/products?category=100130131">
                              티셔츠
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("바지")}
                          >
                            <Link to="/products?category=100130132">바지</Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("운동화")
                            }
                          >
                            <Link to="/products?category=100130133">
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
          <li onMouseEnter={() => handleMouseHover("가전제품")}>
            <Link to="/products?category=200">가전제품</Link>
            {hoveredCategory === "가전제품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li onMouseEnter={() => handleSubMouseHover("TV")}>
                    <Link to="/products?category=200210">TV</Link>
                    {hoveredSubCategory === "TV" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover(" LED TV")
                            }
                          >
                            <Link to="/products?category=200210211">
                              LED TV
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover(" OLED TV")
                            }
                          >
                            <Link to="/products?category=200210212">
                              OLED TV
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover(" QLED TV")
                            }
                          >
                            <Link to="/products?category=200210213">
                              QLED TV
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("냉장고")}>
                    <Link to="/products?category=200220">냉장고</Link>
                    {hoveredSubCategory === "냉장고" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover(" 양문형")
                            }
                          >
                            <Link to="/products?category=200220211">
                              양문형
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("미니 냉장고")
                            }
                          >
                            <Link to="/products?category=200220212">
                              미니 냉장고
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("  와인 냉장고")
                            }
                          >
                            <Link to="/products?category=200220213">
                              와인 냉장고
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("세탁기")}>
                    <Link to="/products?category=200230">세탁기</Link>
                    {hoveredSubCategory === "세탁기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("드럼 세탁기")
                            }
                          >
                            <Link to="/products?category=200230211">
                              드럼 세탁기
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("통돌이 세탁기")
                            }
                          >
                            <Link to="/products?category=200230212">
                              통돌이 세탁기
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("미니 세탁기")
                            }
                          >
                            <Link to="/products?category=200230213">
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
          <li onMouseEnter={() => handleMouseHover("주방용품")}>
            <Link to="/products?category=300">주방용품</Link>
            {hoveredCategory === "주방용품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li onMouseEnter={() => handleSubMouseHover("냄비")}>
                    <Link to="/products?category=300310">냄비</Link>
                    {hoveredSubCategory === "냄비" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("스테인리스")
                            }
                          >
                            <Link to="/products?category=300310311">
                              스테인리스 냄비
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("압력솥")
                            }
                          >
                            <Link to="/products?category=300310312">
                              압력솥
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("법랑 냄비")
                            }
                          >
                            <Link to="/products?category=300310313">
                              법랑 냄비
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("프라이팬")}>
                    <Link to="/products?category=300320">프라이팬</Link>
                    {hoveredSubCategory === "프라이팬" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("일반 팬")
                            }
                          >
                            <Link to="/products?category=300320311">
                              일반 프라이팬
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("논스틱 팬팬")
                            }
                          >
                            <Link to="/products?category=300320312">
                              논스틱 프라이팬
                            </Link>
                          </li>
                          <li
                            onMouseEnter={() =>
                              handleSubSubMouseHover("그릴 팬")
                            }
                          >
                            <Link to="/products?category=300320313">
                              그릴 팬
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li onMouseEnter={() => handleSubMouseHover("식기")}>
                    <Link to="/products?category=300330">식기</Link>
                    {hoveredSubCategory === "식기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("접시")}
                          >
                            <Link to="/products?category=300330311">접시</Link>
                          </li>
                          <li onMouseEnter={() => handleSubSubMouseHover("컵")}>
                            <Link to="/products?category=300330312">컵</Link>
                          </li>
                          <li
                            onMouseEnter={() => handleSubSubMouseHover("수저")}
                          >
                            <Link to="/products?category=300330313">수저</Link>
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

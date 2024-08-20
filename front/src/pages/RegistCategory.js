import React, { useState } from "react";
import CategoryStyle from "../styles/registCategory.module.css";

export default function Category() {
  const [clickedCategory, setClickedCategory] = useState(null);
  const [clickedSubCategory, setClickedSubCategory] = useState(null);

  // 카테고리 클릭 시
  const handleCategoryClick = (category) => {
    setClickedCategory(category);
    setClickedSubCategory(null); // 서브 카테고리 초기화
  };

  // 서브 카테고리 클릭 시
  const handleSubCategoryClick = (subCategory) => {
    setClickedSubCategory(subCategory);
  };

  return (
    <div className={CategoryStyle.categoryBox}>
      <div className={CategoryStyle.navbar}>
        <ul>
          <li>
            <div onClick={() => handleCategoryClick("의류")}>의류</div>
            {clickedCategory === "의류" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li>
                    <div onClick={() => handleSubCategoryClick("남성의류")}>
                      남성의류
                    </div>
                    {clickedSubCategory === "남성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>상의</li>
                          <li>하의</li>
                          <li>운동화</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("여성의류")}>
                      여성의류
                    </div>
                    {clickedSubCategory === "여성의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>원피스</li>
                          <li>스커트</li>
                          <li>하이힐</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("아동의류")}>
                      아동의류
                    </div>
                    {clickedSubCategory === "아동의류" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>티셔츠</li>
                          <li>바지</li>
                          <li>운동화</li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <div onClick={() => handleCategoryClick("가전제품")}>가전제품</div>
            {clickedCategory === "가전제품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li>
                    <div onClick={() => handleSubCategoryClick("TV")}>TV</div>
                    {clickedSubCategory === "TV" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>LED TV</li>
                          <li>OLED TV</li>
                          <li>QLED TV</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("냉장고")}>
                      냉장고
                    </div>
                    {clickedSubCategory === "냉장고" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>양문형</li>
                          <li>미니 냉장고</li>
                          <li>와인 냉장고</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("세탁기")}>
                      세탁기
                    </div>
                    {clickedSubCategory === "세탁기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>드럼 세탁기</li>
                          <li>통돌이 세탁기</li>
                          <li>미니 세탁기</li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <div onClick={() => handleCategoryClick("주방용품")}>주방용품</div>
            {clickedCategory === "주방용품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li>
                    <div onClick={() => handleSubCategoryClick("냄비")}>
                      냄비
                    </div>
                    {clickedSubCategory === "냄비" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>스테인리스 냄비</li>
                          <li>압력솥</li>
                          <li>법랑 냄비</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("프라이팬")}>
                      프라이팬
                    </div>
                    {clickedSubCategory === "프라이팬" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>비철 프라이팬</li>
                          <li>코팅 프라이팬</li>
                          <li>그릴 팬</li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("식기")}>
                      식기
                    </div>
                    {clickedSubCategory === "식기" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li>접시</li>
                          <li>컵</li>
                          <li>수저</li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <div onClick={() => handleCategoryClick("자동차용품")}>
              자동차용품
            </div>
            {clickedCategory === "자동차용품" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>{/* 서브 카테고리와 서브서브 카테고리 추가 */}</ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

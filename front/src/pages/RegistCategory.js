import React, { useState } from "react";
import CategoryStyle from "../styles/registCategory.module.css";

export default function Category({ onCategorySelect }) {
  const [clickedCategory, setClickedCategory] = useState(null);
  const [clickedSubCategory, setClickedSubCategory] = useState(null);
  const [clickedSubSubCategory, setClickedSubSubCategory] = useState(null);

  // 카테고리 클릭 시
  const handleCategoryClick = (category) => {
    setClickedCategory(category);
    setClickedSubCategory(null); // 서브 카테고리 초기화
    setClickedSubSubCategory(null);
  };

  // 서브 카테고리 클릭 시
  const handleSubCategoryClick = (subCategory) => {
    setClickedSubCategory(subCategory);
    setClickedSubSubCategory(null);
  };

  // 서브 서브 카테고리 클릭 시
  const handleSubSubCategoryClick = (subSubCategoryCode) => {
    setClickedSubSubCategory(subSubCategoryCode);
    const fullCategoryCode = `${clickedCategory}${clickedSubCategory}${subSubCategoryCode}`;
    onCategorySelect(fullCategoryCode);
  };

  return (
    <div className={CategoryStyle.categoryBox}>
      <div className={CategoryStyle.navbar}>
        <ul>
          <li>
            <div onClick={() => handleCategoryClick("100")}>의류</div>
            {clickedCategory === "100" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li>
                    <div onClick={() => handleSubCategoryClick("110")}>
                      남성의류
                    </div>
                    {clickedSubCategory === "110" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li onClick={() => handleSubSubCategoryClick("111")}>
                            상의
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("112")}>
                            하의
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("113")}>
                            운동화
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("120")}>
                      여성의류
                    </div>
                    {clickedSubCategory === "120" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li onClick={() => handleSubSubCategoryClick("121")}>
                            원피스
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("122")}>
                            스커트
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("123")}>
                            하이힐
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("130")}>
                      아동의류
                    </div>
                    {clickedSubCategory === "130" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li onClick={() => handleSubSubCategoryClick("131")}>
                            티셔츠
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("132")}>
                            바지
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("133")}>
                            운동화
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </li>
          <li>
            <div onClick={() => handleCategoryClick("200")}>가전제품</div>
            {clickedCategory === "200" && (
              <div className={CategoryStyle.subNavbar}>
                <ul>
                  <li>
                    <div onClick={() => handleSubCategoryClick("210")}>TV</div>
                    {clickedSubCategory === "210" && (
                      <div className={CategoryStyle.subSubNavbar}>
                        <ul>
                          <li onClick={() => handleSubSubCategoryClick("211")}>
                            LED TV
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("212")}>
                            OLED TV
                          </li>
                          <li onClick={() => handleSubSubCategoryClick("213")}>
                            QLED TV
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                  <li>
                    <div onClick={() => handleSubCategoryClick("220")}>
                      냉장고
                    </div>
                    {clickedSubCategory === "220" && (
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
                    <div onClick={() => handleSubCategoryClick("230")}>
                      세탁기
                    </div>
                    {clickedSubCategory === "230" && (
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

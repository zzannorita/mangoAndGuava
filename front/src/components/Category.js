import { Link } from "react-router-dom";
import React, { useState } from "react";
import categories from "../hooks/useCategory";
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
          {categories.map((category) => (
            <li
              key={category.name}
              onMouseEnter={() => handleMouseHover(category.name)}
            >
              <Link to={category.link}>{category.name}</Link>
              {hoveredCategory === category.name && (
                <div className={CategoryStyle.subNavbar}>
                  <ul>
                    {category.subCategories.map((subCategory) => (
                      <li
                        key={subCategory.name}
                        onMouseEnter={() =>
                          handleSubMouseHover(subCategory.name)
                        }
                      >
                        <Link to={subCategory.link}>{subCategory.name}</Link>
                        {hoveredSubCategory === subCategory.name && (
                          <div className={CategoryStyle.subSubNavbar}>
                            <ul>
                              {subCategory.subSubCategories.map(
                                (subSubCategory) => (
                                  <li
                                    key={subSubCategory.name}
                                    onMouseEnter={() =>
                                      handleSubSubMouseHover(
                                        subSubCategory.name
                                      )
                                    }
                                  >
                                    <Link to={subSubCategory.link}>
                                      {subSubCategory.name}
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

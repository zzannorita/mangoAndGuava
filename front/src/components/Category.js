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
  const [isImageHovered, setIsImageHovered] = useState(false);

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
      onMouseEnter={() => setIsImageHovered(true)}
      onMouseLeave={() => {
        setHoveredCategory(null);
        setHoveredSubCategory(null);
        setHoveredSubSubCategory(null);
        setIsImageHovered(false);
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
          {hoveredCategory?.name || ""}
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
          {hoveredSubCategory?.name || ""}
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
          {hoveredSubSubCategory?.name || ""}
        </div>
      </div>
      {isImageHovered && (
        <>
          <div className={CategoryStyle.navbar}>
            {categories.map((category) => (
              <div
                key={category.code}
                onMouseEnter={() => handleMouseHover(category)}
                className={CategoryStyle.navbarItem}
              >
                <Link to={category.link}>{category.name}</Link>
              </div>
            ))}
          </div>

          {hoveredCategory?.subCategories && (
            <div className={CategoryStyle.subNavbar}>
              {hoveredCategory.subCategories.map((subCategory) => (
                <div
                  key={subCategory.code}
                  onMouseEnter={() => handleSubMouseHover(subCategory)}
                  className={CategoryStyle.subNavbarItem}
                >
                  <Link to={subCategory.link}>{subCategory.name}</Link>
                </div>
              ))}
            </div>
          )}

          {hoveredSubCategory?.subSubCategories && (
            <div className={CategoryStyle.subSubNavbar}>
              {hoveredSubCategory.subSubCategories.map((subSubCategory) => (
                <div
                  key={subSubCategory.code}
                  onMouseEnter={() => handleSubSubMouseHover(subSubCategory)}
                  className={CategoryStyle.subSubNavbarItem}
                >
                  <Link to={subSubCategory.link}>{subSubCategory.name}</Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

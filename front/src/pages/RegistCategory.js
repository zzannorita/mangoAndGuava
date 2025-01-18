import React, { useState } from "react";
import CategoryStyle from "../styles/registCategory.module.css";
import categories from "../hooks/useCategory";

export default function Category({ onCategorySelect }) {
  const [clickedCategory, setClickedCategory] = useState(null);
  const [clickedSubCategory, setClickedSubCategory] = useState(null);
  const [clickedSubSubCategory, setClickedSubSubCategory] = useState(null);

  const handleCategoryClick = (categoryCode) => {
    setClickedCategory(categoryCode);
    setClickedSubCategory(null);
    setClickedSubSubCategory(null);
  };

  const handleSubCategoryClick = (subCategoryCode) => {
    setClickedSubCategory(subCategoryCode);
    setClickedSubSubCategory(null);
  };

  const handleSubSubCategoryClick = (subSubCategoryCode, fullCategoryName) => {
    setClickedSubSubCategory(subSubCategoryCode);
    onCategorySelect(subSubCategoryCode, fullCategoryName);
  };

  return (
    <div className={CategoryStyle.categoryBox}>
      <div className={CategoryStyle.navbar}>
        {categories.map((category) => (
          <div
            key={category.code}
            onClick={() => handleCategoryClick(category)}
            className={`${CategoryStyle.navbarItem} ${
              clickedCategory === category ? CategoryStyle.selected : ""
            }`}
          >
            {category.name}
          </div>
        ))}
      </div>

      {clickedCategory?.subCategories && (
        <div className={CategoryStyle.subNavbar}>
          {clickedCategory.subCategories.map((subCategory) => (
            <div
              key={subCategory.code}
              onClick={() => handleSubCategoryClick(subCategory)}
              className={`${CategoryStyle.subNavbarItem} ${
                clickedSubCategory === subCategory ? CategoryStyle.selected : ""
              }`}
            >
              {subCategory.name}
            </div>
          ))}
        </div>
      )}

      {clickedSubCategory?.subSubCategories && (
        <div className={CategoryStyle.subSubNavbar}>
          {clickedSubCategory.subSubCategories.map((subSubCategory) => (
            <div
              key={subSubCategory.code}
              onClick={() =>
                handleSubSubCategoryClick(
                  subSubCategory.code,
                  `${clickedCategory.name} > ${clickedSubCategory.name} > ${subSubCategory.name}`
                )
              }
              className={`${CategoryStyle.subSubNavbarItem} ${
                clickedSubSubCategory === subSubCategory.code
                  ? CategoryStyle.selected
                  : ""
              }`}
            >
              {subSubCategory.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

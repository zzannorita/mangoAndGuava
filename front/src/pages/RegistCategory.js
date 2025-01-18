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
        <ul>
          {categories.map((category) => (
            <li key={category.code}>
              <div onClick={() => handleCategoryClick(category.code)}>
                {category.name}
              </div>
              {clickedCategory === category.code && (
                <div className={CategoryStyle.subNavbar}>
                  <ul>
                    {category.subCategories.map((subCategory) => (
                      <li key={subCategory.code}>
                        <div
                          onClick={() =>
                            handleSubCategoryClick(subCategory.code)
                          }
                        >
                          {subCategory.name}
                        </div>
                        {clickedSubCategory === subCategory.code && (
                          <div className={CategoryStyle.subSubNavbar}>
                            <ul>
                              {subCategory.subSubCategories.map(
                                (subSubCategory) => (
                                  <li
                                    key={subSubCategory.code}
                                    onClick={() =>
                                      handleSubSubCategoryClick(
                                        subSubCategory.code,
                                        `${category.name} > ${subCategory.name} > ${subSubCategory.name}`
                                      )
                                    }
                                  >
                                    {subSubCategory.name}
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

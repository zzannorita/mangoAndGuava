// src/utils/categoryUtils.js

export const categoryMapping = {
  100: "의류",
  110: "남성의류",
  111: "상의",
  112: "하의",
  113: "운동화",
  120: "여성의류",
  121: "상의",
  122: "하의",
  200: "전자제품",
  210: "모바일",
  220: "컴퓨터",
  // 추가적으로 필요한 카테고리 코드와 이름을 넣을 수 있음
};

export const subCategoryMapping = {
  110: {
    111: "상의",
    112: "하의",
    // 필요한 다른 하위 카테고리 추가 가능
  },
  120: {
    121: "상의",
    122: "하의",
    // 필요한 다른 하위 카테고리 추가 가능
  },
  // 추가적으로 필요한 하위 카테고리
};

export const getCategoryNames = (categoryCode) => {
  const firstCategoryCode = categoryCode.slice(0, 3); // 첫 3자리: 100
  const secondCategoryCode = categoryCode.slice(3, 6); // 다음 3자리: 110
  const thirdCategoryCode = categoryCode.slice(6, 9); // 마지막 3자리: 111

  const firstCategory = categoryMapping[firstCategoryCode] || "기타";
  const secondCategory = categoryMapping[secondCategoryCode] || "기타";
  const thirdCategory = subCategoryMapping[secondCategoryCode]
    ? subCategoryMapping[secondCategoryCode][thirdCategoryCode] || "기타"
    : "기타";

  return { firstCategory, secondCategory, thirdCategory };
};

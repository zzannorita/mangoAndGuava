import { useState, useEffect } from "react";

export function useSort(initialProducts, selectedFilter) {
  const [sortedProducts, setSortedProducts] = useState(initialProducts);

  useEffect(() => {
    let filteredProducts = [...initialProducts];

    // 필터에 따른 제품 필터링
    if (selectedFilter !== "전체") {
      filteredProducts = filteredProducts.filter(
        (product) => product.tradeState === selectedFilter
      );
    }

    // 필터링된 제품을 상태에 설정
    setSortedProducts(filteredProducts);
  }, [initialProducts, selectedFilter]); // selectedFilter가 변경될 때마다 다시 계산

  // 최신순, 저가순, 고가순 정렬
  const handleSort = (type) => {
    let sortedArray = [...sortedProducts];

    switch (type) {
      case "최신":
        sortedArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "저가":
        sortedArray.sort((a, b) => a.price - b.price);
        break;
      case "고가":
        sortedArray.sort((a, b) => b.price - a.price);
        break;
      default:
        return;
    }
    setSortedProducts(sortedArray);
  };

  return { products: sortedProducts, handleSort };
}

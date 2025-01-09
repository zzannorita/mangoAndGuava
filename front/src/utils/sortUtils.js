export const sortProducts = (products, sortType) => {
  const sorted = [...products]; // 원본 배열 복사
  switch (sortType) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.productCreatedDate) - new Date(a.productCreatedDate)
      );
    case "lowPrice":
      return sorted.sort((a, b) => a.productPrice - b.productPrice);
    case "highPrice":
      return sorted.sort((a, b) => b.productPrice - a.productPrice);
    default:
      return sorted;
  }
};

export const sortComments = (comments, sortType) => {
  const sorted = [...comments]; // 원본 배열 복사
  switch (sortType) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.originalDate) - new Date(a.originalDate)
      );
    case "highest":
      return sorted.sort((a, b) => b.commentAvg - a.commentAvg);
    case "lowest":
      return sorted.sort((a, b) => a.commentAvg - b.commentAvg);
    default:
      return sorted;
  }
};

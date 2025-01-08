//별점 정렬렬
export const sortComments = (comments, sortType) => {
  switch (sortType) {
    case "newest":
      return comments.sort(
        (a, b) => new Date(b.originalDate) - new Date(a.originalDate)
      ); // 최신순
    case "highest":
      return comments.sort((a, b) => b.commentAvg - a.commentAvg); // 별점 높은 순
    case "lowest":
      return comments.sort((a, b) => a.commentAvg - b.commentAvg); // 별점 낮은 순
    default:
      return comments;
  }
};

//나머지 정렬
export const sortProducts = (products, sortType) => {
  switch (sortType) {
    case "newest":
      return products.sort(
        (a, b) =>
          new Date(b.productCreatedDate) - new Date(a.productCreatedDate)
      );
    case "lowPrice":
      return products.sort((a, b) => a.productPrice - b.productPrice);
    case "highPrice":
      return products.sort((a, b) => b.productPrice - a.productPrice);
    default:
      return products;
  }
};

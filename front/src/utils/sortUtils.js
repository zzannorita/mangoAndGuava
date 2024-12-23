// utils/sortUtils.js

// 댓글 정렬 함수
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

// 상품 정렬 함수 (default로 export)
const sortProducts = (products, sortType) => {
  switch (sortType) {
    case "newest":
      // 최신순 (상품 등록일 기준으로 정렬)
      return products.sort(
        (a, b) =>
          new Date(b.productCreatedDate) - new Date(a.productCreatedDate)
      );
    case "lowPrice":
      // 저가순 (상품 가격 기준으로 정렬)
      return products.sort((a, b) => a.productPrice - b.productPrice);
    case "highPrice":
      // 고가순 (상품 가격 기준으로 정렬)
      return products.sort((a, b) => b.productPrice - a.productPrice);
    default:
      return products;
  }
};

export default sortProducts; // default로 export

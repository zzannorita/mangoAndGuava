const categories = [
  {
    name: "의류",
    link: "/products?category=100",
    subCategories: [
      {
        name: "남성의류",
        link: "/products?category=100110",
        subSubCategories: [
          { name: "상의", link: "/products?category=100110111" },
          { name: "하의", link: "/products?category=100110112" },
          { name: "운동화", link: "/products?category=100110113" },
        ],
      },
      {
        name: "여성의류",
        link: "/products?category=100120",
        subSubCategories: [
          { name: "원피스", link: "/products?category=100120121" },
          { name: "스커트", link: "/products?category=100120122" },
          { name: "하이힐", link: "/products?category=100120123" },
        ],
      },
      {
        name: "아동의류",
        link: "/products?category=100130",
        subSubCategories: [
          { name: "티셔츠", link: "/products?category=100130131" },
          { name: "바지", link: "/products?category=100130132" },
          { name: "운동화", link: "/products?category=100130133" },
        ],
      },
    ],
  },
  {
    name: "가전제품",
    link: "/products?category=200",
    subCategories: [
      {
        name: "TV",
        link: "/products?category=200210",
        subSubCategories: [
          { name: "LED TV", link: "/products?category=200210211" },
          { name: "OLED TV", link: "/products?category=200210212" },
          { name: "QLED TV", link: "/products?category=200210213" },
        ],
      },
      {
        name: "냉장고",
        link: "/products?category=200220",
        subSubCategories: [
          { name: "양문형", link: "/products?category=200220211" },
          { name: "미니 냉장고", link: "/products?category=200220212" },
          { name: "와인 냉장고", link: "/products?category=200220213" },
        ],
      },
      {
        name: "세탁기",
        link: "/products?category=200230",
        subSubCategories: [
          { name: "드럼 세탁기", link: "/products?category=200230211" },
          { name: "통돌이 세탁기", link: "/products?category=200230212" },
          { name: "미니 세탁기", link: "/products?category=200230213" },
        ],
      },
    ],
  },
  {
    name: "주방용품품",
    link: "/products?category=300",
    subCategories: [
      {
        name: "냄비",
        link: "/products?category=300310",
        subSubCategories: [
          { name: "스테인리스", link: "/products?category=300310311" },
          { name: "압력솥", link: "/products?category=300310312" },
          { name: "법랑 냄비", link: "/products?category=300310313" },
        ],
      },
      {
        name: "프라이팬",
        link: "/products?category=300320",
        subSubCategories: [
          { name: "일반 팬", link: "/products?category=300320311" },
          { name: "논스틱 팬", link: "/products?category=300320312" },
          { name: "그릴 팬", link: "/products?category=300320313" },
        ],
      },
      {
        name: "식기",
        link: "/products?category=300330",
        subSubCategories: [
          { name: "접시", link: "/products?category=300330311" },
          { name: "컵", link: "/products?category=300330312" },
          { name: "수저", link: "/products?category=300330313" },
        ],
      },
    ],
  },
];
export default categories;

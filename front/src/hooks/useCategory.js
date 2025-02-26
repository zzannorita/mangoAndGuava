const categories = [
  {
    code: "100",
    name: "의류",
    link: "/products?category=100",
    subCategories: [
      {
        code: "100110",
        name: "남성의류",
        link: "/products?category=100110",
        subSubCategories: [
          {
            code: "100110111",
            name: "상의",
            link: "/products?category=100110111",
          },
          {
            code: "100110112",
            name: "하의",
            link: "/products?category=100110112",
          },
          {
            code: "100110113",
            name: "운동화",
            link: "/products?category=100110113",
          },
        ],
      },
      {
        code: "100120",
        name: "여성의류",
        link: "/products?category=100120",
        subSubCategories: [
          {
            code: "100120121",
            name: "원피스",
            link: "/products?category=100120121",
          },
          {
            code: "100120122",
            name: "스커트",
            link: "/products?category=100120122",
          },
          {
            code: "100120123",
            name: "하이힐",
            link: "/products?category=100120123",
          },
        ],
      },
      {
        code: "100130",
        name: "아동의류",
        link: "/products?category=100130",
        subSubCategories: [
          {
            code: "100130131",
            name: "티셔츠",
            link: "/products?category=100130131",
          },
          {
            code: "100130132",
            name: "바지",
            link: "/products?category=100130132",
          },
          {
            code: "100130133",
            name: "운동화",
            link: "/products?category=100130133",
          },
        ],
      },
    ],
  },
  {
    code: "200",
    name: "가전제품",
    link: "/products?category=200",
    subCategories: [
      {
        code: "200210",
        name: "TV",
        link: "/products?category=200210",
        subSubCategories: [
          {
            code: "200210211",
            name: "LED TV",
            link: "/products?category=200210211",
          },
          {
            code: "200210212",
            name: "OLED TV",
            link: "/products?category=200210212",
          },
          {
            code: "200210213",
            name: "QLED TV",
            link: "/products?category=200210213",
          },
        ],
      },
      {
        code: "200220",
        name: "냉장고",
        link: "/products?category=200220",
        subSubCategories: [
          {
            code: "200220211",
            name: "양문형",
            link: "/products?category=200220211",
          },
          {
            code: "200220212",
            name: "미니 냉장고",
            link: "/products?category=200220212",
          },
          {
            code: "200220213",
            name: "와인 냉장고",
            link: "/products?category=200220213",
          },
        ],
      },
      {
        code: "200230",
        name: "세탁기",
        link: "/products?category=200230",
        subSubCategories: [
          {
            code: "200230211",
            name: "드럼 세탁기",
            link: "/products?category=200230211",
          },
          {
            code: "200230212",
            name: "통돌이 세탁기",
            link: "/products?category=200230212",
          },
          {
            code: "200230213",
            name: "미니 세탁기",
            link: "/products?category=200230213",
          },
        ],
      },
    ],
  },
  {
    code: "300",
    name: "주방용품",
    link: "/products?category=300",
    subCategories: [
      {
        code: "300310",
        name: "냄비",
        link: "/products?category=300310",
        subSubCategories: [
          {
            code: "300310311",
            name: "스테인리스",
            link: "/products?category=300310311",
          },
          {
            code: "300310312",
            name: "압력솥",
            link: "/products?category=300310312",
          },
          {
            code: "300310313",
            name: "법랑 냄비",
            link: "/products?category=300310313",
          },
        ],
      },
      {
        code: "300320",
        name: "프라이팬",
        link: "/products?category=300320",
        subSubCategories: [
          {
            code: "300320311",
            name: "일반 팬",
            link: "/products?category=300320311",
          },
          {
            code: "300320312",
            name: "논스틱 팬",
            link: "/products?category=300320312",
          },
          {
            code: "300320313",
            name: "그릴 팬",
            link: "/products?category=300320313",
          },
        ],
      },
      {
        code: "300330",
        name: "식기",
        link: "/products?category=300330",
        subSubCategories: [
          {
            code: "300330311",
            name: "접시",
            link: "/products?category=300330311",
          },
          {
            code: "300330312",
            name: "컵",
            link: "/products?category=300330312",
          },
          {
            code: "300330313",
            name: "수저",
            link: "/products?category=300330313",
          },
        ],
      },
    ],
  },
];
export default categories;

import React from "react";
import ProductsCard from "./ProductsCard";
import productListStyle from "../styles/productList.module.css";
import { Link } from "react-router-dom";

const ProductList = ({ products }) => {
  //products는 product를 담고있는 배열
  return (
    <div className={productListStyle.product}>
      {products.map((product) => (
        <Link
          key={product.productId}
          to={`/detail?itemId=${product.productId}`}
          className={productListStyle.link}
        >
          <ProductsCard product={product} />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;

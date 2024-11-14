import React from "react";
import ProductsCard from "./ProductsCard";
import PropTypes from "prop-types";
import productListStyle from "../styles/productList.module.css";

const ProductList = ({ products, userData }) => {
  return (
    <div className={productListStyle.product}>
      {products.map((product) => (
        <ProductsCard key={product.id} product={product} userData={userData} />
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      productName: PropTypes.string.isRequired,
      productPrice: PropTypes.number.isRequired,
      productCreatedDate: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  userData: PropTypes.shape({
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductList;

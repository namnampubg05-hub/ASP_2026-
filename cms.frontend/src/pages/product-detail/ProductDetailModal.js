import React from "react";
import "./ProductDetailModal.css";

function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="modal-body">
          <div className="modal-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="modal-info">
            <h2>{product.name}</h2>

            <h3>{product.price} VNĐ</h3>

            <p>{product.description}</p>

            <button className="buy-btn">
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
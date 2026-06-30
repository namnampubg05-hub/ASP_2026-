import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const OrderSuccessPage = () => {
  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-content">
        <div className="order-success">
          <div className="order-success-icon">✅</div>
          <h1>Đặt hàng thành công!</h1>
          <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ để xác nhận đơn hàng trong thời gian sớm nhất.</p>
          <div className="order-success-actions">
            <Link to="/profile?tab=orders" className="checkout-place-order-btn">Xem đơn hàng</Link>
            <Link to="/" className="checkout-back-link" style={{ marginTop: 12 }}>Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

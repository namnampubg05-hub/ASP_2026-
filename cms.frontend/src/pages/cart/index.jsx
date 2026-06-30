import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config';

const CartPage = () => {
    const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="cart-page">
            <Navbar />

            <div className="cart-page-content">
                <div className="cart-page-header">
                    <h1>Giỏ Hàng</h1>
                    <p>{totalItems} sản phẩm trong giỏ</p>
                </div>

                {items.length === 0 ? (
                    <div className="cart-page-empty">
                        <div className="empty-icon">🛒</div>
                        <p>Giỏ hàng của bạn đang trống</p>
                        <Link to="/" className="back-home-btn">Tiếp tục mua sắm</Link>
                    </div>
                ) : (
                    <div className="cart-page-body">
                        <div className="cart-page-items">
                            <div className="cart-page-table-header">
                                <span className="col-product">Sản phẩm</span>
                                <span className="col-price">Đơn giá</span>
                                <span className="col-qty">Số lượng</span>
                                <span className="col-total">Thành tiền</span>
                                <span className="col-action"></span>
                            </div>

                            {items.map((item) => {
                                const stock = item.stockQuantity ?? 999;
                                return (
                                    <div className="cart-page-row" key={item.id}>
                                        <div className="col-product">
                                            <img
                                                src={`${API_BASE_URL}${item.imageUrl}`}
                                                alt={item.name}
                                                className="cart-page-item-img"
                                            />
                                            <div className="cart-page-item-info">
                                                <div className="cart-page-item-name">{item.name}</div>
                                                <div className="cart-page-item-category">Nước giải khát</div>
                                                <div className="cart-page-item-stock">
                                                    {stock > 0 
                                                        ? (stock <= 5 
                                                            ? `⚠️ Chỉ còn ${stock} trong kho` 
                                                            : `✅ Còn ${stock} trong kho`)
                                                        : '❌ Hết hàng'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-price">{formatPrice(item.price)}</div>
                                        <div className="col-qty">
                                            <div className="cart-page-qty">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="col-total">{formatPrice(item.price * item.quantity)}</div>
                                        <div className="col-action">
                                            <button className="cart-page-remove" onClick={() => removeItem(item.id)}>✕</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-page-summary">
                            <div className="cart-page-summary-inner">
                                <h3>Tóm tắt đơn hàng</h3>

                                <div className="summary-row">
                                    <span>Tạm tính</span>
                                    <strong>{formatPrice(totalPrice)}</strong>
                                </div>

                                <div className="summary-row">
                                    <span>Phí vận chuyển</span>
                                    <strong className="text-green">Miễn phí</strong>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row summary-total">
                                    <span>Tổng cộng</span>
                                    <strong className="total-price">{formatPrice(totalPrice)}</strong>
                                </div>

                                <button className="checkout-btn" onClick={handleCheckout}>
                                    {user ? 'Thanh toán ngay' : 'Đăng nhập để thanh toán'}
                                </button>

                                <div className="summary-actions">
                                    <Link to="/" className="continue-shopping">← Tiếp tục mua sắm</Link>
                                    <button className="clear-cart-btn" onClick={clearCart}>Xóa giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

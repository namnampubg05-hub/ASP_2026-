import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import API_BASE_URL from '../../config';

const paymentMethods = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵', desc: 'Nhận hàng và thanh toán bằng tiền mặt' },
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'Chuyển khoản qua tài khoản ngân hàng' },
  { id: 'momo', name: 'Ví MoMo', icon: '📱', desc: 'Thanh toán qua ví điện tử MoMo' },
];

const CheckoutPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.fullName || '',
    customerPhone: user?.phone || '',
    shippingAddress: user?.address || '',
    paymentMethod: 'cod',
    notes: '',
  });
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-content">
          <div className="cart-page-empty">
            <div className="empty-icon">🛒</div>
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="back-home-btn">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

      const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim()) { setError('Vui lòng nhập họ tên'); return; }
    if (!form.customerPhone.trim()) { setError('Vui lòng nhập số điện thoại'); return; }
    if (!form.shippingAddress.trim()) { setError('Vui lòng nhập địa chỉ giao hàng'); return; }

    for (const item of items) {
      const stock = item.stockQuantity ?? 999;
      if (item.quantity > stock) {
        setError(`Sản phẩm "${item.name}" chỉ còn ${stock} trong kho, không đủ ${item.quantity}`);
        return;
      }
    }

    try {
      setOrdering(true);
      const orderData = {
        customerId: user.id,
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        paymentMethod: form.paymentMethod,
        notes: form.notes.trim(),
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity
        }))
      };
      await orderService.create(orderData);
      clearCart();
      navigate('/order-success');
    } catch (e) {
      setError(e.response?.data || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-content">
        <div className="checkout-header">
          <h1>Thanh toán</h1>
          <p>{totalItems} sản phẩm trong giỏ hàng</p>
        </div>

        {error && <div className="checkout-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">
            <div className="checkout-left">
              <div className="checkout-section">
                <h2>Thông tin giao hàng</h2>
                <div className="checkout-form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="checkout-form-row">
                  <div className="checkout-form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      onChange={e => setForm({ ...form, customerPhone: e.target.value })}
                      placeholder="090 123 4567"
                      required
                    />
                  </div>
                  <div className="checkout-form-group">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={form.shippingAddress}
                      onChange={e => setForm({ ...form, shippingAddress: e.target.value })}
                      placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                      required
                    />
                  </div>
                </div>
                <div className="checkout-form-group">
                  <label>Ghi chú (không bắt buộc)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ghi chú cho đơn hàng..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="checkout-section">
                <h2>Phương thức thanh toán</h2>
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className={`payment-method ${form.paymentMethod === method.id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={form.paymentMethod === method.id}
                        onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                      />
                      <span className="payment-method-icon">{method.icon}</span>
                      <div className="payment-method-info">
                        <span className="payment-method-name">{method.name}</span>
                        <span className="payment-method-desc">{method.desc}</span>
                      </div>
                      <span className="payment-method-check">✓</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="checkout-right">
              <div className="checkout-summary">
                <h3>Đơn hàng</h3>
                <div className="checkout-summary-items">
                  {items.map(item => (
                    <div className="checkout-summary-item" key={item.id}>
                      <img
                        src={`${API_BASE_URL}${item.imageUrl}`}
                        alt={item.name}
                        className="checkout-summary-img"
                      />
                      <div className="checkout-summary-info">
                        <span className="checkout-summary-name">{item.name}</span>
                        <span className="checkout-summary-qty">x{item.quantity}</span>
                      </div>
                      <span className="checkout-summary-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-divider" />

                <div className="checkout-summary-row">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Phí vận chuyển</span>
                  <span className="text-green">Miễn phí</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Thanh toán</span>
                  <span>{paymentMethods.find(m => m.id === form.paymentMethod)?.name || 'COD'}</span>
                </div>

                <div className="checkout-summary-divider" />

                <div className="checkout-summary-row checkout-summary-total">
                  <span>Tổng cộng</span>
                  <span className="checkout-total-price">{formatPrice(totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  className="checkout-place-order-btn"
                  disabled={ordering}
                >
                  {ordering ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>

                <Link to="/cart" className="checkout-back-link">← Quay lại giỏ hàng</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

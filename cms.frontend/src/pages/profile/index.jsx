import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import customerService from '../../services/customerService';
import orderService from '../../services/orderService';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../config';

const statusMap = { 0: 'Chờ xác nhận', 1: 'Đang giao', 2: 'Đã giao', 3: 'Đã hủy' };
const statusClass = { 0: 'badge-pending', 1: 'badge-shipping', 2: 'badge-done', 3: 'badge-cancel' };

const paymentMethodMap = {
  cod: 'COD',
  bank_transfer: 'Chuyển khoản',
  momo: 'Ví MoMo',
};

const paymentStatusMap = { 0: 'Chưa thanh toán', 1: 'Đã thanh toán' };

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const formatDate = (d) =>
  new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { items: cartItems, totalPrice: cartTotalPrice } = useCart();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'orders' ? 'orders' : tabParam === 'password' ? 'password' : 'info';
  const [tab, setTab] = useState(initialTab);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const [p, o] = await Promise.all([
          customerService.getById(user.id),
          orderService.getByCustomer(user.id)
        ]);
        setProfile(p);
        setOrders(o);
        setForm({ fullName: p.fullName || '', phone: p.phone || '', address: p.address || '' });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await customerService.update(user.id, form);
      setProfile(updated);
      const updatedUser = { ...user, fullName: updated.fullName };
      localStorage.setItem('customer', JSON.stringify(updatedUser));
      setSuccess('Cập nhật thành công!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setSaving(true);
      await customerService.changePassword(user.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (e) {
      const msg = e.response?.data?.message || 'Đổi mật khẩu thất bại';
      setPasswordError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const orderTotal = (items) => items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="loading-skeleton" style={{ padding: '120px', textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ marginTop: 16, color: '#666' }}>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h1>Tài khoản của tôi</h1>
          <p>Quản lý thông tin cá nhân và đơn hàng</p>
        </div>
      </div>

      <div className="profile-page">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <span className="avatar-letter">{(profile?.fullName || 'U')[0].toUpperCase()}</span>
          </div>
          <h3 className="profile-name">{profile?.fullName}</h3>
          <p className="profile-email">{profile?.email}</p>

          <div className="profile-menu">
            <button className={`profile-menu-item ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Thông tin cá nhân
            </button>
            <button className={`profile-menu-item ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Đổi mật khẩu
            </button>
            <button className={`profile-menu-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Đơn hàng của tôi ({orders.length})
            </button>
            <button className="profile-menu-item logout" onClick={() => { logout(); navigate('/'); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="profile-content">
          {tab === 'info' && (
            <div className="profile-info-card">
              <h2>Thông tin cá nhân</h2>
              <p className="info-desc">Cập nhật thông tin liên lạc của bạn</p>

              {success && <div className="alert-success">{success}</div>}

              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profile?.email || ''} disabled />
                  <span className="form-note">Email không thể thay đổi</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="090 123 4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="123 Nguyễn Huệ, Q.1"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            </div>
          )}

          {tab === 'password' && (
            <div className="profile-info-card">
              <h2>Đổi mật khẩu</h2>
              <p className="info-desc">Cập nhật mật khẩu bảo vệ tài khoản của bạn</p>

              {passwordSuccess && <div className="alert-success">{passwordSuccess}</div>}
              {passwordError && <div className="alert-error">{passwordError}</div>}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Ít nhất 6 ký tự"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div className="profile-orders-card">
              <h2>Đơn hàng của tôi</h2>

              {cartItems.length > 0 && (
                <div className="cart-preview-card">
                  <h3>Giỏ hàng hiện tại ({cartItems.length} sản phẩm)</h3>
                  <div className="order-items">
                    {cartItems.map((item, i) => (
                      <div className="order-item" key={i}>
                        {item.imageUrl && <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.name} className="order-item-img" />}
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">x{item.quantity}</span>
                        <span className="order-item-price">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-total-label">Tạm tính:</span>
                    <span className="order-total">{formatPrice(cartTotalPrice)}</span>
                  </div>
                  <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/cart')}>
                    Thanh toán ngay
                  </button>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="no-products" style={{ padding: '40px 0' }}>
                  <div className="empty-icon">📦</div>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <button className="btn-primary" onClick={() => navigate('/')}>Mua sắm ngay</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div>
                          <span className="order-id">Đơn hàng #{order.id}</span>
                          <span className="order-date">{formatDate(order.orderDate)}</span>
                        </div>
                        <span className={`order-status ${statusClass[order.status] || ''}`}>
                          {statusMap[order.status] || 'Không xác định'}
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, i) => (
                          <div className="order-item" key={i}>
                            {item.imageUrl && <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.productName} className="order-item-img" />}
                            <span className="order-item-name">{item.productName}</span>
                            <span className="order-item-qty">x{item.quantity}</span>
                            <span className="order-item-price">{formatPrice(item.unitPrice)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-payment-info">
                        <span>💳 {paymentMethodMap[order.paymentMethod] || order.paymentMethod}</span>
                        <span>📍 {order.shippingAddress}</span>
                        <span className={`payment-badge ${order.paymentStatus === 1 ? 'paid' : 'unpaid'}`}>
                          {paymentStatusMap[order.paymentStatus] || 'Chưa thanh toán'}
                        </span>
                      </div>
                      <div className="order-footer">
                        <span className="order-total-label">Tổng cộng:</span>
                        <span className="order-total">{formatPrice(orderTotal(order.items))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

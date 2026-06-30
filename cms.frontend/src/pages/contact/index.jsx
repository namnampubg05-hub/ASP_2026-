import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h1>Liên Hệ</h1>
          <p>Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
        </div>
      </div>

      <div className="page-content contact-page">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Thông Tin Liên Hệ</h2>
            <p className="contact-desc">
              Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào. Đội ngũ
              DrinkStore luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <strong>Địa chỉ</strong>
                  <p>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <strong>Hotline</strong>
                  <p>1900 1234</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <strong>Email</strong>
                  <p>info@drinkstore.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div>
                  <strong>Giờ làm việc</strong>
                  <p>Thứ 2 - Chủ nhật: 7:00 - 22:00</p>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <h4>Theo dõi chúng tôi</h4>
              <div className="social-links">
                <span className="social-icon">📘</span>
                <span className="social-icon">📷</span>
                <span className="social-icon">🐦</span>
                <span className="social-icon">▶️</span>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h3>Gửi thành công!</h3>
                <p>Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                <button className="btn-primary-hero" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Gửi Tin Nhắn</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="090 123 4567"
                  />
                </div>
                <div className="form-group">
                  <label>Nội dung</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn..."
                    rows="5"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-hero" style={{ width: '100%' }}>
                  Gửi Tin Nhắn
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = ({ scrollTo }) => {
    const navigate = useNavigate();

    return (
        <footer id="footer" className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h3>👕 DrinkStore</h3>
                    <p>
                        Hệ thống thời trang nam hàng đầu Việt Nam.
                        Cam kết sản phẩm chất lượng, giao hàng siêu tốc.
                    </p>
                    <div className="socials">
                        <span>📘</span>
                        <span>📷</span>
                        <span>🐦</span>
                        <span>▶️</span>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Về Chúng Tôi</h4>
                    <ul>
                        <li onClick={() => scrollTo("home")}>Giới Thiệu</li>
                        <li>Tuyển Dụng</li>
                        <li>Chính Sách</li>
                        <li>Điều Khoản</li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Hỗ Trợ</h4>
                    <ul>
                        <li>Trung Tâm</li>
                        <li>Hướng Dẫn</li>
                        <li>Thanh Toán</li>
                        <li>Đổi Trả</li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Liên Hệ</h4>
                    <ul>
                        <li>📞 1900 1234</li>
                        <li>✉️ info@namcms.com</li>
                        <li>📍 123 Nguyễn Huệ, Q.1</li>
                        <li>🕐 7:00 - 22:00</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                © 2026 DrinkStore. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ show, onClose }) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className="login-prompt-overlay" onClick={onClose}>
            <div className="login-prompt-modal" onClick={(e) => e.stopPropagation()}>
                <div className="login-prompt-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f7971e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                <h3>Vui lòng đăng nhập</h3>
                <p>Bạn cần đăng nhập để sử dụng tính năng thêm vào giỏ hàng.</p>
                <div className="login-prompt-actions">
                    <button className="login-prompt-cancel" onClick={onClose}>Huỷ</button>
                    <button className="login-prompt-confirm" onClick={() => navigate('/login')}>Đồng ý</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPrompt;

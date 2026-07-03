import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetToken('');
        if (!email.trim()) {
            setError('Vui lòng nhập email');
            return;
        }
        try {
            setLoading(true);
            const res = await authService.forgotPassword({ email });
            setMessage(res.message);
            if (res.resetToken) {
                setResetToken(res.resetToken);
            }
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message || 'Yêu cầu thất bại';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">DrinkStore</Link>
                    <h2>Quên Mật Khẩu</h2>
                    <p>Nhập email để nhận link đặt lại mật khẩu</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success" style={{ color: 'green', marginBottom: 10, textAlign: 'center' }}>{message}</div>}

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                    </button>
                </form>

                {resetToken && (
                    <div style={{ marginTop: 15, padding: 10, background: '#f0f8ff', borderRadius: 6, textAlign: 'center', fontSize: 14 }}>
                        <p style={{ fontWeight: 600, marginBottom: 6 }}>Token đặt lại mật khẩu (dùng để test):</p>
                        <code style={{ wordBreak: 'break-all', fontSize: 12 }}>{resetToken}</code>
                        <p style={{ marginTop: 8 }}>
                            <Link to={`/reset-password?token=${resetToken}`}>Nhấn vào đây để đặt lại mật khẩu</Link>
                        </p>
                    </div>
                )}

                <div className="auth-footer">
                    <Link to="/login">Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

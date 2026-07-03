import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!token) {
            setError('Token không hợp lệ');
            return;
        }
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        try {
            setLoading(true);
            const res = await authService.resetPassword({ token, newPassword });
            setMessage(res.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message || 'Đặt lại mật khẩu thất bại';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="auth-page">
                <div className="auth-box">
                    <div className="auth-header">
                        <h2>Liên kết không hợp lệ</h2>
                        <p>Token đặt lại mật khẩu không hợp lệ hoặc đã bị thiếu.</p>
                    </div>
                    <div className="auth-footer">
                        <Link to="/forgot-password">Gửi yêu cầu mới</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">DrinkStore</Link>
                    <h2>Đặt Lại Mật Khẩu</h2>
                    <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success" style={{ color: 'green', marginBottom: 10, textAlign: 'center' }}>{message}</div>}

                    <div className="auth-field">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Quay lại đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

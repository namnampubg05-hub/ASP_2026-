import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        try {
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message || (data?.errors && Object.values(data.errors).flat()[0]) || 'Đăng nhập thất bại';
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
                    <h2>Đăng Nhập</h2>
                    <p>Chào mừng bạn quay trở lại</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>
                </form>

                <div className="auth-footer">
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

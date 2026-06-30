import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setLoading(true);
            await register({
                FullName: form.fullName,
                Email: form.email,
                Password: form.password,
                Phone: form.phone || null,
                Address: form.address || null
            });
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.message || (data?.errors && Object.values(data.errors).flat()[0]) || 'Đăng ký thất bại';
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
                    <h2>Đăng Ký</h2>
                    <p>Tạo tài khoản mới</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-field">
                        <label>Họ tên *</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Nhập họ tên"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="auth-field">
                        <label>Email *</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="auth-row">
                        <div className="auth-field">
                            <label>Mật khẩu *</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="auth-field">
                            <label>Xác nhận mật khẩu *</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="auth-row">
                        <div className="auth-field">
                            <label>Số điện thoại</label>
                            <input
                                name="phone"
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="auth-field">
                            <label>Địa chỉ</label>
                            <input
                                name="address"
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import API_BASE_URL from '../config';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);
    const searchTimer = useRef(null);

    const handleClickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setShowSearch(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
            setShowUserMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (!value.trim()) {
            setSearchResults([]);
            setShowSearch(false);
            return;
        }
        searchTimer.current = setTimeout(async () => {
            try {
                const data = await productService.search(value.trim());
                setSearchResults(data);
                setShowSearch(true);
            } catch {
                setSearchResults([]);
            }
        }, 300);
    };

    const scrollTo = (id) => {
        if (!isHome) {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return;
        }
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const goHome = () => {
        if (isHome) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <nav className="navbar">
            <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }}>
                DrinkStore
            </div>

            <ul className="menu">
                <li onClick={goHome}>Trang Chủ</li>
                <li onClick={() => navigate('/products')}>Sản Phẩm</li>
                <li onClick={() => navigate('/news')}>Tin Tức</li>
                <li onClick={() => navigate('/contact')}>Liên Hệ</li>
            </ul>

            <div className="actions">
                <div className="search-wrapper" ref={searchRef}>
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                    />
                    {showSearch && (
                        <div className="search-dropdown">
                            {searchResults.length === 0 ? (
                                <div className="search-empty">Không tìm thấy sản phẩm</div>
                            ) : (
                                searchResults.map((p) => (
                                    <Link
                                        key={p.id}
                                        to={`/product/${p.id}`}
                                        className="search-item"
                                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                    >
                                        <img
                                            src={`${API_BASE_URL}${p.imageUrl}`}
                                            alt={p.name}
                                            className="search-item-img"
                                        />
                                        <div className="search-item-info">
                                            <div className="search-item-name">{p.name}</div>
                                            <div className="search-item-price">{formatPrice(p.price)}</div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="user-menu-wrapper" ref={userMenuRef}>
                        <button className="user-btn" onClick={() => setShowUserMenu(prev => !prev)}>
                            <span className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
                            <span className="user-name">{user.fullName}</span>
                            <svg className={`user-arrow ${showUserMenu ? 'open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-dropdown-header">
                                    <div className="user-dropdown-avatar">{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
                                    <div className="user-dropdown-meta">
                                        <strong>{user.fullName}</strong>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className="user-dropdown-divider"></div>
                                <div className="user-dropdown-items">
                                    <button className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/profile'); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <span>Thông tin tài khoản</span>
                                    </button>
                                    <button className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/profile?tab=password'); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <span>Đổi mật khẩu</span>
                                    </button>
                                    <button className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate('/profile?tab=orders'); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                        <span>Đơn hàng của tôi</span>
                                    </button>
                                </div>
                                <div className="user-dropdown-divider"></div>
                                <button className="user-dropdown-logout" onClick={() => { logout(); navigate('/'); }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="login-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
                        <button className="register-btn" onClick={() => navigate('/register')}>Đăng ký</button>
                    </>
                )}

                <div className="cart-wrapper">
                    <span className="icon-btn" onClick={() => navigate('/cart')}>
                        🛒
                        {totalItems > 0 && <span className="badge">{totalItems}</span>}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import productService from '../../services/productService';
import categoryProductService from '../../services/categoryProductService';
import LoginPrompt from '../../components/LoginPrompt';
import API_BASE_URL from '../../config';

const ICONS = ["🥤", "🧃", "☕", "🧊", "🍹", "💧"];

const ProductsPage = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [searchName, setSearchName] = useState('');
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategories, setShowCategories] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchName, priceRange, sortBy]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    productService.getAllProducts(),
                    categoryProductService.getAllCategoryProducts()
                ]);
                setProducts(productsData);
                setCategories(categoriesData);
                if (productsData.length > 0) {
                    const prices = productsData.map(p => p.price);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([0, Math.ceil(maxPrice / 100000) * 100000]);
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = products.filter(p => {
        if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;
        if (selectedCategory && p.categoryProductId !== selectedCategory) return false;
        if (p.price < priceRange[0]) return false;
        if (p.price > priceRange[1]) return false;
        return true;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return b.id - a.id;
    });

    const totalPages = Math.ceil(sorted.length / productsPerPage);
    const paginatedProducts = sorted.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const clearFilters = () => {
        setSearchName('');
        setPriceRange([0, priceRange[1] || 1000000]);
        setSortBy('newest');
    };

    const hasFilters = searchName || priceRange[0] > 0 || (priceRange[1] < (priceRange[1] || 1000000));

    return (
        <div className="app">
            <Navbar />

            <div className="products-banner">
                <div className="products-banner-bg">
                    <div className="products-banner-shape shape-1" />
                    <div className="products-banner-shape shape-2" />
                    <div className="products-banner-shape shape-3" />
                </div>
                <div className="products-banner-content">
                    <span className="products-banner-tag">Khám phá ngay</span>
                    <h1>
                        Tất Cả <span>Sản Phẩm</span>
                    </h1>
                    <p>Bộ sưu tập đa dạng với hơn {products.length} sản phẩm chất lượng cao</p>
                </div>
            </div>

            <div className="products-body">
                {loading ? (
                    <div className="products-loading">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="product-skeleton">
                                <div className="skeleton-img" />
                                <div className="skeleton-info">
                                    <div className="skeleton-line w-70" />
                                    <div className="skeleton-line w-50" />
                                    <div className="skeleton-line w-40" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="products-layout">
                        <aside className="products-sidebar">
                            <div className="sidebar-section">
                                <h3 className="sidebar-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    Tìm kiếm
                                </h3>
                                <input
                                    type="text"
                                    className="sidebar-input"
                                    placeholder="Nhập tên sản phẩm..."
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>

                            <div className={`sidebar-section sidebar-collapse ${showCategories ? 'expanded' : ''}`}>
                                <h3 className="sidebar-title sidebar-collapse-header" onClick={() => setShowCategories(prev => !prev)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                                    Danh mục
                                    <svg className={`collapse-arrow ${showCategories ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                </h3>
                                <div className="sidebar-category-list">
                                    {showCategories && (
                                        <>
                                    <button
                                        className={`sidebar-category-btn ${selectedCategory === null ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        <span className="cat-icon">🏷️</span>
                                        Tất cả
                                    </button>
                                    {categories.map((cat, index) => (
                                        <button
                                            key={cat.id}
                                            className={`sidebar-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                            onClick={() => setSelectedCategory(cat.id)}
                                        >
                                            <span className="cat-icon">{ICONS[index % ICONS.length]}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                    </>
                                    )}
                                </div>
                            </div>

                            <div className="sidebar-section">
                                <h3 className="sidebar-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                    Khoảng giá
                                </h3>
                                <div className="price-range-slider">
                                    <div className="price-range-labels">
                                        <span>Từ: {formatPrice(priceRange[0])}</span>
                                        <span>Đến: {formatPrice(priceRange[1])}</span>
                                    </div>
                                    <div className="price-range-track">
                                        <input
                                            type="range"
                                            min="0"
                                            max={priceRange[1] || 1000000}
                                            step="10000"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setPriceRange(prev => [Math.min(val, prev[1]), prev[1]]);
                                            }}
                                            className="price-range-input"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={priceRange[1] || 1000000}
                                            step="10000"
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setPriceRange(prev => [prev[0], Math.max(val, prev[0])]);
                                            }}
                                            className="price-range-input"
                                        />
                                    </div>
                                    <div className="price-range-presets">
                                        <button type="button" onClick={() => setPriceRange([0, priceRange[1]])} className={priceRange[0] === 0 ? 'active' : ''}>Tất cả</button>
                                        <button type="button" onClick={() => setPriceRange([0, 100000])} className={priceRange[0] === 0 && priceRange[1] === 100000 ? 'active' : ''}>&lt;100K</button>
                                        <button type="button" onClick={() => setPriceRange([100000, 300000])} className={priceRange[0] === 100000 && priceRange[1] === 300000 ? 'active' : ''}>100K-300K</button>
                                        <button type="button" onClick={() => setPriceRange([300000, 500000])} className={priceRange[0] === 300000 && priceRange[1] === 500000 ? 'active' : ''}>300K-500K</button>
                                        <button type="button" onClick={() => setPriceRange([500000, priceRange[1]])} className={priceRange[0] === 500000 ? 'active' : ''}>500K+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="sidebar-section">
                                <h3 className="sidebar-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                                    Sắp xếp
                                </h3>
                                <select
                                    className="sidebar-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá: Thấp → Cao</option>
                                    <option value="price-desc">Giá: Cao → Thấp</option>
                                </select>
                            </div>

                            {hasFilters && (
                                <button className="sidebar-clear" onClick={clearFilters}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    Xóa bộ lọc
                                </button>
                            )}
                        </aside>

                        <div className="products-main">
                            <div className="products-toolbar">
                                <span className="products-count">{sorted.length} / {products.length} sản phẩm</span>
                            </div>

                            {sorted.length === 0 ? (
                                <div className="products-empty">
                                    <div className="products-empty-icon">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                            <line x1="8" y1="11" x2="14" y2="11"/>
                                        </svg>
                                    </div>
                                    <h3>Không tìm thấy sản phẩm</h3>
                                    <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé</p>
                                    <button className="products-empty-btn" onClick={clearFilters}>
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="products-grid">
                                        {paginatedProducts.map((item) => (
                                        <div className="product-card-modern" key={item.id}>
                                            <div className="product-card-badge">Bán chạy</div>
                                            <button
                                                className="product-card-wishlist"
                                                onClick={(e) => { e.stopPropagation(); }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                                </svg>
                                            </button>
                                            <div className="product-card-image" onClick={() => navigate(`/product/${item.id}`)}>
                                                <img
                                                    src={`${API_BASE_URL}${item.imageUrl}`}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        e.target.src = "https://placehold.co/300x300?text=No+Image";
                                                    }}
                                                />
                                                <div className="product-card-overlay">
                                                    <button className="product-card-overlay-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
                                                        Xem chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="product-card-body" onClick={() => navigate(`/product/${item.id}`)}>
                                                <h3 className="product-card-name">{item.name}</h3>
                                                <div className="product-card-meta">
                                                    <span className="product-card-rating">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffd200" stroke="#ffd200" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                                        4.9 <span>(120 đánh giá)</span>
                                                    </span>
                                                </div>
                                                <div className="product-card-stock">
                                                    {item.stockQuantity > 0 
                                                        ? (item.stockQuantity <= 5 
                                                            ? `⚠️ Chỉ còn ${item.stockQuantity}` 
                                                            : `✅ Còn ${item.stockQuantity}`)
                                                        : '❌ Hết hàng'}
                                                </div>
                                                <div className="product-card-price">{formatPrice(item.price)}</div>
                                            </div>
                                            <button className="product-card-add" onClick={() => user ? addItem(item) : setShowLoginPrompt(true)}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                Thêm vào giỏ
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                    <nav className="products-pagination" aria-label="Phân trang sản phẩm">
                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            aria-label="Trang trước"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                                aria-label={`Trang ${page}`}
                                                aria-current={currentPage === page ? 'page' : undefined}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            aria-label="Trang sau"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </div>
    );
};

export default ProductsPage;

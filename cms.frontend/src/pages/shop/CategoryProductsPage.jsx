import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import CategoryList from './CategoryProductList';
import productService from '../../services/productService';
import LoginPrompt from '../../components/LoginPrompt';
import API_BASE_URL from '../../config';

const CategoryProductsPage = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { user } = useAuth();
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getByCategoryId(id);
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm theo danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    return (
        <div className="category-page">
            <Navbar />

            {/* Categories strip */}
            <section className="section category-section category-strip">
                <div className="section-header">
                    <h2>
                        Danh Mục <span className="highlight">Sản Phẩm</span>
                    </h2>
                    <p>Chọn danh mục để xem sản phẩm</p>
                </div>
                <CategoryList />
            </section>

            {/* Products */}
            <section className="section product-section">
                <div className="section-header">
                    <h2>
                        Tất Cả Sản Phẩm
                    </h2>
                    <p>{products.length} sản phẩm được tìm thấy</p>
                </div>

                {loading ? (
                    <div className="loading-skeleton">
                        <div className="spinner"></div>
                        Đang tải sản phẩm...
                    </div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <div className="empty-icon">🥤</div>
                        <p>Chưa có sản phẩm nào trong danh mục này.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((item) => (
                            <div className="product-card" key={item.id}>
                                <div className="product-badge">Bán chạy</div>
                                <div className="product-img">
                                    <img
                                        src={`${API_BASE_URL}${item.imageUrl}`}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src =
                                                "https://placehold.co/300x300?text=No+Image";
                                        }}
                                    />
                                    <div className="quick-actions">
                                        <button onClick={() => user ? addItem(item) : setShowLoginPrompt(true)}>🛒</button>
                                        <button onClick={() => navigate(`/product/${item.id}`)}>👁️</button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <div className="product-name">{item.name}</div>
                                    <div className="product-price">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.price)}
                                    </div>
                                    <div className="product-stock">
                                        {item.stockQuantity > 0 
                                            ? (item.stockQuantity <= 5 
                                                ? `⚠️ Chỉ còn ${item.stockQuantity} sản phẩm` 
                                                : `✅ Còn hàng (${item.stockQuantity})`)
                                            : '❌ Hết hàng'}
                                    </div>
                                    <div className="product-rating">
                                        ⭐⭐⭐⭐⭐ <span>(120)</span>
                                    </div>
                                </div>

                                <div className="product-footer">
                                    <button onClick={() => navigate(`/product/${item.id}`)}>Xem Chi Tiết</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </div>
    );
};

export default CategoryProductsPage;

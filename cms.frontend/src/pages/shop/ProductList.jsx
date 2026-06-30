import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import LoginPrompt from '../../components/LoginPrompt';
import API_BASE_URL from '../../config';

const ProductList = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const openDetail = (item) => {
        navigate(`/product/${item.id}`);
    };

    if (loading) {
        return (
            <div className="loading-skeleton">
                <div className="spinner"></div>
                Đang tải sản phẩm...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="no-products">
                <div className="empty-icon">🥤</div>
                <p>Chưa có sản phẩm nào trong hệ thống.</p>
            </div>
        );
    }

    return (
        <>

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
                                <button onClick={() => openDetail(item)}>👁️</button>
                            </div>
                        </div>

                        <div className="product-info">
                            <div className="product-name">{item.name}</div>
                            <div className="product-category">Nước giải khát</div>
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
                            <button onClick={() => openDetail(item)}>
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </>
    );
};

export default ProductList;

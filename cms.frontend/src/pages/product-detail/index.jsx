import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from '../../components/LoginPrompt';
import Navbar from '../../components/Navbar';
import productService from '../../services/productService';
import API_BASE_URL from '../../config';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);

        if (data.categoryProductId) {
          const byCategory = await productService.getByCategoryId(data.categoryProductId);
          setRelated(byCategory.filter(p => p.id !== data.id).slice(0, 4));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = () => {
    if (!user) { setShowLoginPrompt(true); return; }
    if (product.stockQuantity < qty) {
      alert(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product);
  };

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="detail-skeleton">
          <div className="skeleton-body" style={{ maxWidth: 1200, margin: '100px auto', padding: '0 20px' }}>
            <div className="skeleton-line w-30" />
            <div style={{ display: 'flex', gap: 50, marginTop: 30 }}>
              <div className="skeleton-square" />
              <div style={{ flex: 1 }}>
                <div className="skeleton-line w-60" />
                <div className="skeleton-line w-40" />
                <div className="skeleton-line w-50" />
                <div className="skeleton-line w-100" />
                <div className="skeleton-line w-70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app">
        <Navbar />
        <div className="not-found-page">
          <div className="not-found-icon">🥤</div>
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Quay về trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <div className="product-detail-wrapper">
        <div className="pd-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <Link to="/">Sản phẩm</Link>
          <span className="sep">›</span>
          <span>{product.name}</span>
        </div>

        <div className="pd-main">
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img
                src={`${API_BASE_URL}${product.imageUrl}`}
                alt={product.name}
                onError={e => e.target.src = "https://placehold.co/600x600?text=No+Image"}
              />
              {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                <span className="pd-badge pd-badge-low">Sắp hết</span>
              )}
              {product.stockQuantity === 0 && (
                <span className="pd-badge pd-badge-out">Hết hàng</span>
              )}
            </div>
          </div>

          <div className="pd-info">
            <div className="pd-category">{product.categoryName}</div>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating">
              <div className="stars">
                {'★'.repeat(4)}{'☆'.repeat(1)}
              </div>
              <span className="rating-count">(12 đánh giá)</span>
              <span className="sold-count">| Đã bán 256</span>
            </div>

            <div className="pd-price">
              <span className="pd-price-current">{formatPrice(product.price)}</span>
              <span className="pd-price-old">{formatPrice(product.price * 1.2)}</span>
              <span className="pd-price-discount">-20%</span>
            </div>

            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="meta-label">Mã sản phẩm</span>
                <span className="meta-value">#{product.id}</span>
              </div>
              <div className="pd-meta-item">
                <span className="meta-label">Tình trạng</span>
                <span className={`meta-value ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`}>
                  {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
              <div className="pd-meta-item">
                <span className="meta-label">Kho</span>
                <span className="meta-value">{product.stockQuantity} sản phẩm</span>
              </div>
            </div>

            {product.description && (
              <div className="pd-description">
                <h3>Mô tả sản phẩm</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="pd-actions">
              <div className="pd-qty">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="pd-add-cart" onClick={handleAdd}>
                🛒 Thêm vào giỏ
              </button>
            </div>

            <div className="pd-guarantee">
              <div className="guarantee-item">
                <span>✅</span>
                <span>Chính hãng 100%</span>
              </div>
              <div className="guarantee-item">
                <span>🔄</span>
                <span>Đổi trả 7 ngày</span>
              </div>
              <div className="guarantee-item">
                <span>🚚</span>
                <span>Miễn phí giao hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section">
          <div className="related-header">
            <h2>Sản phẩm <span className="highlight">liên quan</span></h2>
          </div>
          <div className="related-grid products-related">
            {related.map(p => (
              <div className="product-card-sm" key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
                <div className="product-card-sm-img">
                  <img src={`${API_BASE_URL}${p.imageUrl}`} alt={p.name}
                    onError={e => e.target.src = "https://placehold.co/400x400?text=No+Image"} />
                </div>
                <div className="product-card-sm-body">
                  <h4>{p.name}</h4>
                  <span className="product-card-sm-price">{formatPrice(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🥤 DrinkStore</h3>
            <p>Hệ thống phân phối nước giải khát chính hãng hàng đầu Việt Nam.</p>
          </div>
          <div className="footer-col">
            <h4>Về Chúng Tôi</h4>
            <ul>
              <li>Giới Thiệu</li>
              <li>Tuyển Dụng</li>
              <li>Chính Sách</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Hỗ Trợ</h4>
            <ul>
              <li>Trung Tâm</li>
              <li>Hướng Dẫn</li>
              <li>Thanh Toán</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Liên Hệ</h4>
            <ul>
              <li>📞 1900 1234</li>
              <li>✉️ info@drinkstore.com</li>
              <li>📍 123 Nguyễn Huệ, Q.1</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© 2026 DrinkStore. All rights reserved.</div>
      </footer>

      <LoginPrompt show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
};

export default ProductDetailPage;

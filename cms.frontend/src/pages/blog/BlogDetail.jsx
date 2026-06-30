import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../config';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogService.getById(id);
        setPost(data);

        const all = await blogService.getAllPosts();
        const related = all
          .filter(p => p.id !== data.id && p.categoryName === data.categoryName)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="app">
        <Navbar />
        <div className="detail-skeleton">
          <div className="skeleton-banner" />
          <div className="skeleton-body">
            <div className="skeleton-line w-40" />
            <div className="skeleton-line w-70" />
            <div className="skeleton-line w-100" />
            <div className="skeleton-line w-100" />
            <div className="skeleton-line w-60" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="app">
        <Navbar />
        <div className="not-found-page">
          <div className="not-found-icon">📰</div>
          <h2>Không tìm thấy bài viết</h2>
          <p>Bài viết không tồn tại hoặc đã bị xóa.</p>
          <button className="btn-primary" onClick={() => navigate('/news')}>Quay lại tin tức</button>
        </div>
      </div>
    );
  }

  const readingTime = Math.max(1, Math.ceil((post.content || '').length / 500));

  return (
    <div className="app">
      <Navbar />

      <article className="post-article">
        <div className="post-hero" style={{ backgroundImage: `url(${API_BASE_URL}/images/${post.imageUrl})` }}>
          <div className="post-hero-overlay" />
          <div className="post-hero-content">
            <div className="post-hero-tags">
              <span className="tag tag-category">{post.categoryName || "Tin tức"}</span>
              <span className="tag tag-time">{readingTime} phút đọc</span>
            </div>
            <h1>{post.title}</h1>
            <div className="post-hero-meta">
              <div className="post-author">
                <div className="author-avatar">A</div>
                <div>
                  <strong>Admin</strong>
                  <span className="author-date">{formatDate(post.createdDate)}</span>
                </div>
              </div>
              <div className="post-hero-actions">
                <button className="share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  🔗
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="post-body">
          <div className="post-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="sep">›</span>
            <Link to="/news">Tin tức</Link>
            <span className="sep">›</span>
            <span>{post.title}</span>
          </div>

          {post.shortDescription && (
            <div className="post-excerpt">
              <p>{post.shortDescription}</p>
            </div>
          )}

          <div className="post-content">
            {post.content || "Đang cập nhật nội dung..."}
          </div>

          <div className="post-share">
            <span>Chia sẻ bài viết:</span>
            <div className="share-icons">
              <span className="share-icon" onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>📘</span>
              <span className="share-icon" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`)}>🐦</span>
              <span className="share-icon" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Đã sao chép link!'); }}>🔗</span>
            </div>
          </div>

          <div className="post-nav">
            <button className="btn-outline" onClick={() => navigate('/news')}>
              ← Quay lại tin tức
            </button>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="related-section">
          <div className="related-header">
            <h2>Bài viết <span className="highlight">liên quan</span></h2>
            <Link to="/news" className="view-all">Xem tất cả →</Link>
          </div>
          <div className="related-grid">
            {relatedPosts.map(rp => (
              <div className="related-card" key={rp.id} onClick={() => navigate(`/news/${rp.id}`)}>
                <div className="related-img">
                  <img src={`${API_BASE_URL}/images/${rp.imageUrl}`} alt={rp.title}
                    onError={e => e.target.src = "https://placehold.co/600x400?text=No+Image"} />
                </div>
                <div className="related-body">
                  <span className="related-cat">{rp.categoryName}</span>
                  <h4>{rp.title}</h4>
                  <span className="related-date">{formatDate(rp.createdDate)}</span>
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
    </div>
  );
};

export default PostDetailPage;

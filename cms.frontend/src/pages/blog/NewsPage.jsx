import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../config';

const NewsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllPosts();
        const sorted = [...data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setPosts(sorted);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const openDetail = (post) => {
    navigate(`/news/${post.id}`);
  };

  const categories = ['all', ...new Set(posts.map(p => p.categoryName).filter(Boolean))];
  const filtered = category === 'all' ? posts : posts.filter(p => p.categoryName === category);

  return (
    <div className="app">
      <Navbar />

      <div className="page-banner">
        <div className="page-banner-overlay" />
        <div className="page-banner-content">
          <h1>Tin Tức</h1>
          <p>Cập nhật xu hướng và ưu đãi hấp dẫn mỗi ngày</p>
        </div>
      </div>

      <div className="page-content">
        <div className="filter-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-skeleton" style={{ padding: '60px', textAlign: 'center' }}>
            <div className="spinner" />
            <p style={{ marginTop: 16, color: '#666' }}>Đang tải tin tức...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px', textAlign: 'center' }}>
            <p>Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filtered.map((post) => (
              <div className="news-card" key={post.id}>
                <div className="news-img">
                  <img
                    src={`${API_BASE_URL}/images/${post.imageUrl}`}
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="news-body">
                  <div className="news-date">
                    📅 {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                    {post.categoryName && (
                      <span className="news-category"> • {post.categoryName}</span>
                    )}
                  </div>
                  <h5 className="news-title">
                    <span style={{ cursor: 'pointer' }} onClick={() => openDetail(post)}>
                      {post.title}
                    </span>
                  </h5>
                  <p className="news-excerpt">
                    {post.shortDescription || "Đang cập nhật nội dung tóm tắt..."}
                  </p>
                  <span className="news-link" style={{ cursor: 'pointer' }} onClick={() => openDetail(post)}>
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default NewsPage;

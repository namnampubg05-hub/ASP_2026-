import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';
import API_BASE_URL from '../../config';

const LatestBlog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                const sorted = [...data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setPosts(sorted.slice(0, 3));
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

    if (loading) {
        return (
            <div className="loading-skeleton">
                <div className="spinner"></div>
                Đang tải tin tức...
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="empty-state">
                <p>Chưa có bài viết tin tức nào.</p>
            </div>
        );
    }

    return (
        <div className="news-grid">
            {posts.map((post) => (
                <div className="news-card" key={post.id}>
                    <div className="news-img">
                        <img
                            src={`${API_BASE_URL}/images/${post.imageUrl}`}
                            alt={post.title}
                            onError={(e) => {
                                e.target.src =
                                    "https://placehold.co/600x400?text=No+Image";
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
    );
};

export default LatestBlog;

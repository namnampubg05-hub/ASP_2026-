import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';

const ICONS = ["🥤", "🧃", "☕", "🧊", "🍹", "💧"];

const CategoryProductList = () => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, []);

    if (loading) {
        return (
            <div className="loading-skeleton">
                <div className="spinner"></div>
                Đang tải danh mục...
            </div>
        );
    }

    return (
        <div className="category-container">
            {categoryProducts.length === 0 ? (
                <div className="empty-state">Không có danh mục nào.</div>
            ) : (
                <div className="category-grid">
                    {categoryProducts.map((item, index) => (
                        <button
                            key={item.id}
                            className="category-card"
                            onClick={() => navigate(`/category/${item.id}`)}
                        >
                            <span className="cat-icon">
                                {ICONS[index % ICONS.length]}
                            </span>
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProductList;

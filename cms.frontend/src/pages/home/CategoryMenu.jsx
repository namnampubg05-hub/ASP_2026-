import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryProductService from '../../services/categoryProductService';

const ICONS = ["🥤", "🧃", "☕", "🧊", "🍹", "💧", "🧋", "🍵"];
const COLORS = [
  ["#f7971e", "#ffd200"],
  ["#e53935", "#ff6f61"],
  ["#2ecc71", "#27ae60"],
  ["#3498db", "#2980b9"],
  ["#9b59b6", "#8e44ad"],
  ["#1abc9c", "#16a085"],
  ["#e67e22", "#d35400"],
  ["#34495e", "#2c3e50"],
];

const CategoryMenu = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="home-categories">
                <div className="home-categories-loading">
                    <div className="spinner"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="home-categories">
            <div className="home-categories-header">
                <h2>Danh Mục <span>Sản Phẩm</span></h2>
            </div>
            <div className="home-categories-grid">
                {categories.length === 0 ? (
                    <span className="home-categories-empty">Không có danh mục</span>
                ) : (
                    categories.map((item, index) => {
                        const [c1, c2] = COLORS[index % COLORS.length];
                        return (
                            <div
                                key={item.id}
                                className="home-category-card"
                                onClick={() => navigate(`/category/${item.id}`)}
                            >
                                <div className="home-category-icon" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                                    {ICONS[index % ICONS.length]}
                                </div>
                                <h3 className="home-category-name">{item.name}</h3>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default CategoryMenu;

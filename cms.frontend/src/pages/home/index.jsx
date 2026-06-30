import React from 'react';
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';

const HomePage = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app">
      <Header />

      <HeroBanner scrollTo={scrollTo} />

      <CategoryMenu />

      <section id="flash-sale" className="flash-sale">
        <div className="flash-content">
          <div className="flash-badge">⏰ Kết thúc trong</div>
          <h2>🔥 Flash Sale Hôm Nay</h2>
          <div className="countdown">
            <div className="time-block">
              <span className="num">08</span>
              <span className="lbl">Giờ</span>
            </div>
            <div className="time-block">
              <span className="num">45</span>
              <span className="lbl">Phút</span>
            </div>
            <div className="time-block">
              <span className="num">30</span>
              <span className="lbl">Giây</span>
            </div>
          </div>
          <p>Giảm đến 50% cho tất cả sản phẩm thời trang</p>
          <button className="btn-flash">Mua Ngay — Ưu Đãi Có Hạn</button>
        </div>
      </section>

      <section id="products" className="section product-section">
        <div className="section-header">
          <h2>
            Sản Phẩm <span className="highlight">Bán Chạy</span>
          </h2>
          <p>Những sản phẩm được yêu thích nhất trong tuần</p>
        </div>
        <ProductGrid />
      </section>

      <section id="news" className="section news-section">
        <div className="section-header">
          <h2>
            Tin Tức <span className="highlight">Mới Nhất</span>
          </h2>
          <p>Cập nhập xu hướng thời trang và ưu đãi hấp dẫn mỗi ngày</p>
        </div>
        <LatestBlog />
      </section>

      <Footer scrollTo={scrollTo} />
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect, useCallback } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=1200&h=600&fit=crop",
    badge: "🔥 Giảm đến 50% hôm nay",
    title: "Thế Giới",
    accent: "Nước Giải Khát",
    desc: "Hơn 500+ sản phẩm chính hãng từ các thương hiệu nổi tiếng toàn cầu.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&h=600&fit=crop",
    badge: "⚡ Giao hàng siêu tốc",
    title: "Đồ Uống",
    accent: "Chính Hãng",
    desc: "Cam kết sản phẩm chất lượng 100% từ các nhà sản xuất hàng đầu thế giới.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=1200&h=600&fit=crop",
    badge: "🎉 Ưu đãi đặc biệt",
    title: "Mua Sắm",
    accent: "Thỏa Thích",
    desc: "Tích điểm đổi quà, miễn phí vận chuyển cho đơn hàng trên 200K.",
  },
];

export default function HeroBanner({ scrollTo }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(slides.length - 1);

  const goTo = useCallback((index) => {
    setPrev(current);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prevSlide = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="home" className="hero hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === current ? "active" : ""} ${index === prev ? "prev" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero-overlay" />

      <div className="overlay">
        <div className="badge-hero">{slides[current].badge}</div>
        <h1>
          {slides[current].title} <span>{slides[current].accent}</span>
        </h1>
        <p>{slides[current].desc}</p>
        <div className="hero-btns">
          <button className="btn-primary-hero" onClick={() => scrollTo("products")}>Mua Ngay</button>
          <button className="btn-secondary-hero">Khám Phá</button>
        </div>
      </div>

      <div className="hero-float">
        <div className="float-card">
          <div className="number">500+</div>
          <div className="label">Sản phẩm</div>
        </div>
        <div className="float-card">
          <div className="number">99%</div>
          <div className="label">Hài lòng</div>
        </div>
        <div className="float-card">
          <div className="number">60'</div>
          <div className="label">Giao hàng</div>
        </div>
      </div>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>❮</button>
      <button className="carousel-arrow carousel-arrow-right" onClick={next}>❯</button>
    </section>
  );
}
